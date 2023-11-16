"use client";

import { Filter, Event } from "nostr-tools";
import { useEffect } from "react";

import { filterPosts } from "@/lib/utils";
import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import { cacheProfiles, cacheZapReciepts } from "@/lib/nostr";
import Post from "@/components/posts/Post";
import useStore from "@/stores/useStore";

import { useSearchParams } from "next/navigation";

export default function NewPosts() {
  // const { readRelays } = useRelayStateStore();
  // const { subscribePool } = useRelayStore();
  // const { newPosts, addNewPost, newPostLimit, setNewPostLimit } =
  //   useEventStore();

  const relayStateStore = useStore(useRelayStateStore, (state) => state);
  const relayStore = useStore(useRelayStore, (state) => state);
  const eventStore = useStore(useEventStore, (state) => state);

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const cacheRecentEvents = () => {
    if (!relayStateStore || !relayStore || !eventStore) {
      return;
    }

    console.log("Caching recent events");

    const newPostFilter: Filter = {
      kinds: [1070],
      limit: 10,
    };

    const newPosts = eventStore?.newPosts;

    if (newPosts && newPosts.length > 0) {
      const lastEvent = newPosts.slice(-1)[0];
      newPostFilter.until = lastEvent.created_at - 10;
    }

    const pubkeys = new Set<string>();

    const onEvent = (event: Event) => {
      console.log(event);
      eventStore?.addNewPost(event);
      if (!pubkeys.has(event.pubkey)) {
        cacheProfiles([event.pubkey]);
      }
      cacheZapReciepts(event.id);
      pubkeys.add(event.pubkey);
    };

    relayStore?.subscribePool(
      relayStateStore?.readRelays,
      newPostFilter,
      onEvent,
      () => {},
    );
  };

  useEffect(() => {
    if (!relayStateStore || !relayStore || !eventStore) {
      return;
    }

    const newPosts = eventStore?.newPosts;
    const newPostLimit = eventStore?.newPostLimit;

    if (newPostLimit > newPosts?.length * 0.7) {
      cacheRecentEvents();
    }
  }, [relayStateStore?.readRelays, eventStore?.newPostLimit]);

  // useEffect(() => {
  //   // check if number of posts is less greater than greater than 70% of
  //   // the list of cached posts and if so, fetch more posts
  //   if (newPostLimit > newPosts?.length * 0.7) {
  //     cacheRecentEvents();
  //   }
  // }, [newPostLimit]);

  return (
    <>
      {eventStore &&
        filterPosts(filter, eventStore?.newPosts)
          ?.slice(0, eventStore?.newPostLimit)
          .map((post, idx) => <Post post={post} key={idx} />)}

      {!filter && (
        <div className="flex w-full justify-center py-8">
          <button
            //TODO: only add 5 are more posts to add
            onClick={() =>
              eventStore?.setNewPostLimit(eventStore?.newPostLimit + 5)
            }
            className="rounded-md bg-purple-500/90 px-4 py-2 text-sm text-white hover:bg-purple-500 dark:bg-purple-600/90 dark:text-zinc-200 dark:hover:bg-purple-600"
          >
            more
          </button>
        </div>
      )}
    </>
  );
}
