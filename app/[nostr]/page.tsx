"use client";

import { usePathname } from "next/navigation";
import { Event, Filter, nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

import Post from "@/components/posts/Post";
import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import useLoginStore from "@/stores/loginStore";

export default function NewsItemPage() {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { cachedPost, setCachedPost } = useEventStore();
  const { userKeyPair } = useLoginStore();

  const pathname = usePathname();

  const [event, setEvent] = useState<Event | null>(null);

  let nevent: string | null = null;
  if (pathname) {
    nevent = pathname.split("/").pop() || null;
  }

  useEffect(() => {
    if (cachedPost) {
      setEvent(cachedPost);
      setCachedPost(null);
      return;
    }

    if (!nevent) {
      return;
    }

    const nevent_data: any = nip19.decode(nevent).data;

    const filter: Filter = {
      kinds: [1070],
      limit: 1,
      authors: [nevent_data.author],
      ids: [nevent_data.id],
    };

    const onEvent = (event: Event) => {
      setEvent(event);
    };

    subscribePool(readRelays, filter, onEvent, () => {});
  }, [readRelays]);

  return (
    <div className="flex min-h-screen flex-col items-start py-2">
      {event && <Post post={event} />}
      {/* <div className="w-full py-4"> */}
      {/*   <PostTextArea text={text} setText={setText} /> */}
      {/* </div> */}
      {/**/}
      {/* <button */}
      {/*   className="flex max-w-[4rem] items-center justify-center gap-x-2 rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500" */}
      {/*   // onClick={handlePublish} */}
      {/* > */}
      {/*   reply */}
      {/* </button> */}

      {nevent && <div className="w-full"></div>}
    </div>
  );
}
