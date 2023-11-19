"use client";

import { Filter, Event } from "nostr-tools";
import { useEffect, useState } from "react";

import { filterPosts } from "@/lib/utils";
import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import { cacheProfiles, cacheZapReciepts } from "@/lib/nostr";
import Post from "@/components/posts/Post";

import { useSearchParams } from "next/navigation";
import SimpleNotification from "../notifications/SimpleNotification";

export default function NewPosts() {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { newPosts, addNewPost, newPostLimit, setNewPostLimit, zapReciepts } =
    useEventStore();

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const [showNotification, setShowNotification] = useState(false);

  const cacheRecentEvents = () => {
    console.log("Caching recent events");

    const newPostFilter: Filter = {
      kinds: [1070],
      limit: 6,
    };

    if (newPosts && newPosts.length > 0) {
      const lastEvent = newPosts.slice(-1)[0];
      newPostFilter.until = lastEvent.created_at - 10;
    }

    const pubkeys = new Set<string>();
    const events = [];

    const onEvent = (event: Event) => {
      // console.log(event);
      events.push(event);
      addNewPost(event);
      if (!pubkeys.has(event.pubkey)) {
        cacheProfiles([event.pubkey]);
      }
      if (!zapReciepts[event.id]) {
        cacheZapReciepts(event.id);
      }

      pubkeys.add(event.pubkey);
    };

    const onEOSE = () => {
      if (events.length === 0) {
        alert("No new posts");
      }
    };

    subscribePool(readRelays, newPostFilter, onEvent, onEOSE);
  };

  useEffect(() => {
    if (newPosts.length > 0) {
      return;
    }
    cacheRecentEvents();
  }, [readRelays]);

  const increaseLimit = () => {
    if (newPostLimit - newPosts?.length >= 5) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      return;
    }
    setNewPostLimit(newPostLimit + 5);

    if (newPostLimit > newPosts?.length * 0.7) {
      cacheRecentEvents();
    }
  };

  return (
    <>
      {filterPosts(filter, newPosts)
        ?.slice(0, newPostLimit)
        .map((post, idx) => <Post post={post} key={idx} />)}
      {!filter && (
        <div className="flex w-full justify-center py-8">
          <button
            onClick={() => increaseLimit()}
            className="rounded-lg border dark:border-zinc-700 border-zinc-300 shadow-lg shadow-black/5 px-3 py-2 font-mono text-zinc-600 hover:text-zinc-500 dark:text-zinc-200 dark:hover:text-zinc-100"
            // className="rounded-lg border border-zinc-400 px-1 font-mono text-base text-zinc-400 hover:text-zinc-300"
          >
            more
          </button>
        </div>
      )}
      <SimpleNotification
        type="info"
        title="info"
        message="no more posts to show"
        show={showNotification}
        setShow={setShowNotification}
      />
    </>
  );
}
