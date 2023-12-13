"use client";

import { pc } from "~/lib/nostr";
import useProfileEvent from "~/nostr-query/client/hooks/useProfileEvent";
import { type UseProfileEventParams } from "~/nostr-query/types";
import useEventStore from "~/store/event-store";
import { useRelayStore } from "~/store/relay-store";
import Image from "next/image";
import { type Event } from "nostr-tools";

import UserMenu from "./UserMenu";

type Props = {
  pubkey: string;
  initialProfile?: Event | undefined | null;
};

export default function UserProfile({ pubkey, initialProfile }: Props) {
  const BOT_AVATAR_ENDPOINT = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${pubkey}`;
  const { profileMap, addProfile } = useEventStore();
  const { subRelays } = useRelayStore();

  const params: UseProfileEventParams = {
    pubkey: pubkey,
    relays: subRelays,
    shouldFetch: !profileMap[pubkey],
    onProfileEvent: (event) => {
      addProfile(pubkey, event);
    },
  };

  useProfileEvent(params);

  return (
    <UserMenu>
      <Image
        src={
          pc(profileMap[pubkey] ?? initialProfile).picture ??
          BOT_AVATAR_ENDPOINT
        }
        alt=""
        width={34}
        height={34}
        quality={100}
        className="aspect-square rounded-full border border-zinc-200 dark:border-zinc-800"
      />
    </UserMenu>
  );
}
