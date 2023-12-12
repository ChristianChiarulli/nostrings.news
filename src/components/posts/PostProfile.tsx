import { useEffect, useState } from "react";

import { Skeleton } from "~/components/ui/skeleton";
import { fetchProfileEvent, pc } from "~/nostr-query/lib/profile";
import useEventStore from "~/store/event-store";
import { useRelayStore } from "~/store/relay-store";
import { nip19, type Event } from "nostr-tools";

type Props = {
  pubkey: string;
};

export default function PostProfile({ pubkey }: Props) {
  const { profileMap, addProfile } = useEventStore();
  const { subRelays } = useRelayStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileEvent: Event | null = await fetchProfileEvent({
          pubkey,
          relays: subRelays,
        });
        if (!profileEvent) {
          setLoading(false);
          return;
        }
        addProfile(pubkey, profileEvent);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    if (!profileMap[pubkey]) {
      setLoading(true);
      void fetchProfile();
    } else {
      setLoading(false);
      // console.log("profileMap", profileMap);
    }
  }, [addProfile, profileMap, pubkey, subRelays]);

  // const params: UseProfileEventParams = {
  //   pubkey: pubkey,
  //   relays: subRelays,
  //   shouldFetch: !profileMap[pubkey],
  //   onProfileEvent: (event) => {
  //     addProfile(pubkey,event);
  //   },
  // };

  // const { loading } = useProfileEvent(params);

  if (loading) {
    return (
      <span className="flex items-center">
        <Skeleton className="h-3 w-[4rem]" />
      </span>
    );
  }

  return (
    <span className="cursor-pointer text-xxs font-light text-purple-500/90 hover:underline dark:text-purple-400/90">
      {pc(profileMap[pubkey]).name ??
        `npub${nip19.npubEncode(pubkey).slice(-4)}`}
    </span>
  );
}
