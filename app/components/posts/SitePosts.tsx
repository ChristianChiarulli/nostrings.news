"use client";

import { Filter, Event } from "nostr-tools";
import { useEffect } from "react";

import { filterPosts } from "@/lib/utils";
import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import { cacheProfiles } from "@/lib/nostr";
import Post from "@/components/posts/Post";

import { useSearchParams } from "next/navigation";

export default function SitePosts() {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { sitePosts, addSitePost, sitePostLimit, setSitePostLimit } =
    useEventStore();

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const site = searchParams.get("site") || "";

  function getSitesArrayFromURL(site: string | null) {
    if (site) {
      if (site.includes(",")) {
        return site.split(",");
      } else {
        return [site];
      }
    } else {
      return [];
    }
  }

  const cacheRecentEvents = () => {
    const newPostFilter: Filter = {
      kinds: [1070],
      limit: 10,
      "#w": getSitesArrayFromURL(site),
    };

    if (sitePosts && sitePosts[site]) {
      const lastEvent = sitePosts[site].slice(-1)[0];
      newPostFilter.until = lastEvent.created_at - 10;
    }

    const pubkeys = new Set<string>();

    const onEvent = (event: Event) => {
      console.log(event);
      addSitePost(site, event);
      if (!pubkeys.has(event.pubkey)) {
        cacheProfiles([event.pubkey]);
      }
      pubkeys.add(event.pubkey);
    };

    subscribePool(readRelays, newPostFilter, onEvent, () => {});
  };

  useEffect(() => {
    cacheRecentEvents();
  }, []);

  useEffect(() => {
    // check if number of posts is less greater than greater than 70% of
    // the list of cached posts and if so, fetch more posts
    if (sitePosts && sitePostLimit > sitePosts[site]?.length * 0.7) {
      cacheRecentEvents();
    }
  }, [sitePostLimit]);

  return (
    <>
      {sitePosts &&
        filterPosts(filter, sitePosts[site])
          ?.slice(0, sitePostLimit)
          .map((post, idx) => <Post post={post} key={idx} />)}

      <div className="flex w-full justify-center py-8">
        <button
          onClick={() => setSitePostLimit(sitePostLimit + 5)}
          className="rounded-md bg-purple-500/90 px-4 py-2 text-sm text-white hover:bg-purple-500 dark:bg-purple-600/90 dark:text-zinc-200 dark:hover:bg-purple-600"
        >
          more
        </button>
      </div>
    </>
  );
}
