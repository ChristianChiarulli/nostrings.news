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

export default function SitePosts() {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { sitePosts, addSitePost, sitePostLimit, setSitePostLimit, zapReciepts } =
    useEventStore();
  const [showNotification, setShowNotification] = useState(false);

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
      limit: 6,
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
      if (!zapReciepts[event.id]) {
        cacheZapReciepts(event.id);
      }
      
      pubkeys.add(event.pubkey);
    };

    subscribePool(readRelays, newPostFilter, onEvent, () => {});
  };

  useEffect(() => {
    if (sitePosts && sitePosts[site] && sitePosts[site].length > 0) {
      return;
    }
    cacheRecentEvents();
  }, [readRelays]);

  const increaseLimit = () => {
    if (sitePostLimit - sitePosts[site]?.length >= 5) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      return;
    }
    setSitePostLimit(sitePostLimit + 5);

    if (sitePostLimit > sitePosts[site]?.length * 0.7) {
      cacheRecentEvents();
    }
  };

  return (
    <>
      {sitePosts &&
        filterPosts(filter, sitePosts[site])
          ?.slice(0, sitePostLimit)
          .map((post, idx) => <Post post={post} key={idx} />)}

      <div className="flex w-full justify-center py-8">
        <button
          onClick={() => increaseLimit()}
          className="rounded-md bg-purple-500/90 px-4 py-2 text-sm text-white hover:bg-purple-500 dark:bg-purple-600/90 dark:text-zinc-200 dark:hover:bg-purple-600"
        >
          more
        </button>
      </div>

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
