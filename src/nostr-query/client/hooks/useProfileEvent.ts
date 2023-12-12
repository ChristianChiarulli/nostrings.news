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
    async function fetchProfile() {
      try {
        const profileEvent: Event | null = await fetchProfileEvent({
          pubkey,
          relays,
        });
        if (!profileEvent) {
          setLoading(false);
          return;
        }
        setProfileEvent(profileEvent);
        onProfileEvent(profileEvent);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    if (shouldFetch) {
      setLoading(true);
      void fetchProfile();
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
