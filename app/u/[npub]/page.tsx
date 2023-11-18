"use client";

import { usePathname } from "next/navigation";
import { Event, Filter, nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import Avatar from "@/components/profile/Avatar";
import { Profile } from "@/types";
import { parseProfileContent } from "@/lib/utils";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import UserPosts from "@/components/posts/UserPosts";

export default function NewsItemPage() {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { profileEvent, setProfileEvent } = useEventStore();
  const [profile, setProfile] = useState<Profile>(
    parseProfileContent(
      JSON.stringify({
        name: "",
        picture: "",
        about: "",
        lud16: "",
        nip05: "",
        website: "",
      }),
    ),
  );
  const [pubkey, setPubkey] = useState<string>("");

  const pathname = usePathname();

  let npub: string | null = null;
  if (pathname) {
    npub = pathname.split("/").pop() || null;
  }

  useEffect(() => {
    if (!npub) {
      return;
    }

    const pubkey: string = nip19.decode(npub).data as string;
    setPubkey(pubkey);

    if (profileEvent && profileEvent[pubkey]) {
      setProfile(parseProfileContent(profileEvent[pubkey]?.content));
      return;
    }

    const filter: Filter = {
      kinds: [0],
      limit: 1,
      authors: [pubkey],
    };

    const onEvent = (event: Event) => {
      console.log("profile event", event);
      setProfileEvent(event.pubkey, event);
      setProfile(parseProfileContent(event.content));
    };

    subscribePool(readRelays, filter, onEvent, () => {});
  }, [readRelays]);

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex border-b border-zinc-200 py-3 dark:border-zinc-700">
        <div className="mr-4 flex-shrink-0 self-center">
          <Avatar
            picture={profile.picture}
            pubkey={npub || ""}
            className="h-12 w-12 border-2 border-zinc-200 dark:border-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <h4 className="text-lg font-bold dark:text-zinc-50">
              {profile.name}
            </h4>
            <span className="flex items-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <CheckBadgeIcon className="inline-block h-4 w-4" />
              {profile.nip05}
            </span>
          </div>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            {profile.about}
          </p>
        </div>
      </div>
      {pubkey && <UserPosts pubkey={pubkey} />}
    </div>
  );
}
