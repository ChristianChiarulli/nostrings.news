import { useCallback, useState } from "react";

import {
  type PublishEventStatus,
  type UsePublishEventParams,
} from "~/nostr-query/types";
import { type Event } from "nostr-tools";

import defaultPool from "../../lib/pool";

// TODO: expose callback functions for success and error
// TODO: add retry logic
const usePublishEvent = ({
  pool = defaultPool,
  relays,
  // onSuccess = () => {},
  // onError = () => {},
  // retry = 0,
}: UsePublishEventParams) => {
  const [status, setStatus] = useState<PublishEventStatus>("idle");

  const publishEvent = useCallback(
    async (event: Event | undefined, onSeen: (event: Event) => void) => {
      setStatus("pending");

      if (!event) {
        setStatus("error");
        return null;
      }
      const pubs = pool.publish(relays, event);

      try {
        await Promise.allSettled(pubs);
      } catch (e) {
        console.error("Error publishing event: ", e);
        setStatus("error");
      }

      const publishedEvent = await pool.get(relays, {
        ids: [event.id],
      });

      if (publishedEvent) {
        onSeen(publishedEvent);
        setStatus("success");
      }

      return publishedEvent;
    },
    [pool, relays],
  );

  return { publishEvent, status };
};

export default usePublishEvent;
