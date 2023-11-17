import { Bars2Icon } from "@heroicons/react/24/outline";
import { Event, Filter } from "nostr-tools";
import { useEffect, useState } from "react";

import { parseProfileContent } from "@/lib/utils";
import useLoginStore from "@/stores/loginStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import { Profile } from "@/types";

import UserMenu from "../menus/UserMenu";

import Avatar from "./Avatar";

export default function UserProfile() {
  const { userKeyPair, userEvent, setUserEvent } = useLoginStore();
  const { readRelays } = useRelayStateStore();
  const { subscribe } = useRelayStore();

  const [profile, setProfile] = useState<Profile | null>(
    parseProfileContent(userEvent?.content),
  );

  const setupUserProfile = () => {
    const filter: Filter = {
      authors: [userKeyPair.publicKey],
      kinds: [0],
      limit: 1,
    };

    if (userEvent) {
      return;
    }

    const onEvent = (event: Event) => {
      setUserEvent(event);
    };

    subscribe(readRelays, filter, onEvent, () => {});
  };

  useEffect(() => {
    setupUserProfile();
  }, [userKeyPair, readRelays]);

  useEffect(() => {
    if (userEvent) {
      setProfile(parseProfileContent(userEvent?.content));
    } else {
      setupUserProfile();
    }
  }, [userEvent]);

  return (
    <UserMenu>
      <div className="flex items-center gap-x-2 rounded-full bg-zinc-100 px-2 py-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800">
        <Bars2Icon className="inline-block h-4 w-4 dark:text-zinc-100" />
        <Avatar
          className="inline-block h-6 w-6"
          pubkey={userKeyPair.publicKey}
          picture={profile?.picture || ""}
        />
      </div>
    </UserMenu>
  );
}
