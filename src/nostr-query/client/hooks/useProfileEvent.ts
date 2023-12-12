import { useEffect, useState } from "react";

import { fetchProfileEvent } from "~/nostr-query/lib/profile";
import { type UseProfileEventParams } from "~/nostr-query/types";
import { type Event } from "nostr-tools";

import defaultPool from "../../lib/pool";

const useProfileEvent = ({
  pool = defaultPool,
  relays,
  pubkey,
  shouldFetch = true,
  onProfileEvent = (event) => {},
}: UseProfileEventParams) => {
  const [loading, setLoading] = useState(true);
  const [profileEvent, setProfileEvent] = useState<Event>();

  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      const _profileEvent = await fetchProfileEvent({
        pool,
        relays,
        pubkey,
      });

      // const profileEvent = profileEvents.find(
      //   (event) => event.pubkey === pubkey,
      // );

      if (_profileEvent) {
        setProfileEvent(_profileEvent);
        onProfileEvent(_profileEvent);
      }
      setLoading(false);
    };

    if (shouldFetch) {
      void fetchEvents();
    } else {
      setLoading(false);
    }

    return () => {
      setLoading(false);
    };
  }, [pool, relays]);

  return { loading, profileEvent };
};

export default useProfileEvent;
