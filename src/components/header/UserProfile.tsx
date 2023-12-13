"use client";

import { pc } from "~/lib/nostr";
import useProfileEvent from "~/nostr-query/client/hooks/useProfileEvent";
import { type UseProfileEventParams } from "~/nostr-query/types";
import useEventStore from "~/store/event-store";
import { useRelayStore } from "~/store/relay-store";
import Image from "next/image";
import { type Event } from "nostr-tools";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserMenu from "./UserMenu";

type Props = {
  pubkey: string;
  initialProfile?: Event | undefined | null;
};

export default function UserProfile({ pubkey, initialProfile }: Props) {
  const { profileMap, addProfile } = useEventStore();
  const { subRelays } = useRelayStore();
  const BOT_AVATAR_ENDPOINT = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${pubkey}`;

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
      <Avatar>
        <AvatarImage
          src={
            pc(profileMap[pubkey] ?? initialProfile).picture ??
            BOT_AVATAR_ENDPOINT
          }
          alt={pubkey.slice(0, 4)}
        />
        {/* <AvatarFallback>{pubkey.slice(0, 2)}</AvatarFallback> */}
      </Avatar>
    </UserMenu>
  );
}
