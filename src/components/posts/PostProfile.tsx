import { Skeleton } from "~/components/ui/skeleton";
import { pc } from "~/nostr-query/lib/profile";
import useEventStore from "~/store/event-store";
import { useRelayStore } from "~/store/relay-store";
import { nip19 } from "nostr-tools";
import { type UseProfileEventParams } from "~/nostr-query/types";
import useProfileEvent from "~/nostr-query/client/hooks/useProfileEvent";

type Props = {
  pubkey: string;
};

export default function PostProfile({ pubkey }: Props) {
  const { profileMap, addProfile } = useEventStore();
  const { subRelays } = useRelayStore();

  const params: UseProfileEventParams = {
    pubkey: pubkey,
    relays: subRelays,
    shouldFetch: !profileMap[pubkey],
    onProfileEvent: (event) => {
      addProfile(pubkey,event);
    },
  };

  const { loading } = useProfileEvent(params);

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
