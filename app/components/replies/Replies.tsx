"use client";

import { Filter, Event } from "nostr-tools";
import { useEffect, useState } from "react";

import { filterPosts } from "@/lib/utils";
import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import { cacheProfiles, cacheZapReciepts } from "@/lib/nostr";

import { useSearchParams } from "next/navigation";
import Reply from "./Reply";

type Props = {
  event: Event;
};

export default function Replies({ event }: Props) {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { zapReciepts, replyEvents, setReplyEvents } = useEventStore();

  // const [replies, setReplies] = useState<Event[]>([]);

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const cacheRecentEvents = () => {
    console.log("Caching recent events");

    const newPostFilter: Filter = {
      kinds: [1],
      "#e": [event.id],
    };

    if (replyEvents[event.id] && replyEvents[event.id].length > 0) {
      const lastEvent = replyEvents[event.id].slice(-1)[0];
      newPostFilter.until = lastEvent.created_at - 10;
    }

    const pubkeys = new Set<string>();
    const events: Event[] = [];

    const onEvent = (event: Event) => {
      console.log(event);
      events.push(event);
      // addNewPost(event);
      if (!pubkeys.has(event.pubkey)) {
        cacheProfiles([event.pubkey]);
      }
      if (!zapReciepts[event.id]) {
        cacheZapReciepts(event.id);
      }

      pubkeys.add(event.pubkey);
    };

    const onEOSE = () => {
      setReplyEvents(event.id, events.reverse());
      if (events.length === 0) {
        alert("No new posts");
      }
    };

    subscribePool(readRelays, newPostFilter, onEvent, onEOSE);
  };

  useEffect(() => {
    if (replyEvents[event.id] && replyEvents[event.id].length > 0) {
      return;
    }
    cacheRecentEvents();
  }, [readRelays]);

  // const increaseLimit = () => {
  //   if (newPostLimit - newPosts?.length >= 5) {
  //     setShowNotification(true);
  //     setTimeout(() => {
  //       setShowNotification(false);
  //     }, 2000);
  //     return;
  //   }
  //   setNewPostLimit(newPostLimit + 5);
  //
  //   if (newPostLimit > newPosts?.length * 0.7) {
  //     cacheRecentEvents();
  //   }
  // };

  return (
    <>
      {replyEvents[event.id] && filterPosts(filter, replyEvents[event.id]).map((post, idx) => (
        <Reply event={post} key={idx} />
      ))}
      {/* <SimpleNotification */}
      {/*   type="info" */}
      {/*   title="info" */}
      {/*   message="no more posts to show" */}
      {/*   show={showNotification} */}
      {/*   setShow={setShowNotification} */}
      {/* /> */}
    </>
  );
}
