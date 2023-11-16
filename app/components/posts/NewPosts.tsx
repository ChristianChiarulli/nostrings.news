"use client";

import { Filter, Event } from "nostr-tools";
import { useEffect } from "react";

import { filterPosts } from "@/lib/utils";
import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import { cacheProfiles, cacheZapReciepts } from "@/lib/nostr";
import Post from "@/components/posts/Post";

import { useSearchParams } from "next/navigation";

export default function NewPosts() {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { newPosts, addNewPost, newPostLimit, setNewPostLimit } =
    useEventStore();

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const cacheRecentEvents = () => {
    console.log("Caching recent events");

    const newPostFilter: Filter = {
      kinds: [1070],
      limit: 10,
    };

    if (newPosts && newPosts.length > 0) {
      const lastEvent = newPosts.slice(-1)[0];
      newPostFilter.until = lastEvent.created_at - 10;
    }

    const pubkeys = new Set<string>();

    const onEvent = (event: Event) => {
      console.log(event);
      addNewPost(event);
      if (!pubkeys.has(event.pubkey)) {
        cacheProfiles([event.pubkey]);
      }
      cacheZapReciepts(event.id);
      pubkeys.add(event.pubkey);
    };

    subscribePool(readRelays, newPostFilter, onEvent, () => {});
  };

  useEffect(() => {
    if (newPostLimit > newPosts?.length * 0.7) {
      cacheRecentEvents();
    }
  }, [readRelays, newPostLimit]);

  return (
    <>
      {filterPosts(filter, newPosts)
        ?.slice(0, newPostLimit)
        .map((post, idx) => <Post post={post} key={idx} />)}
      {!filter && (
        <div className="flex w-full justify-center py-8">
          <button
            //TODO: only add 5 are more posts to add
            onClick={() => setNewPostLimit(newPostLimit + 5)}
            className="rounded-md bg-purple-500/90 px-4 py-2 text-sm text-white hover:bg-purple-500 dark:bg-purple-600/90 dark:text-zinc-200 dark:hover:bg-purple-600"
          >
            more
          </button>
        </div>
      )}
    </>
  );
}
