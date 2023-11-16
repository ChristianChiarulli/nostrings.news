"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Event, nip19 } from "nostr-tools";
import { EventPointer } from "nostr-tools/lib/types/nip19";

import {
  addUpZaps,
  formatSats,
  getTagValue,
  parseProfileContent,
  shortenHash,
} from "@/lib/utils";
import useEventStore from "@/stores/eventStore";
import { useEffect, useState } from "react";
import { Profile } from "@/types";
import Zap from "../actions/Zap";
import useAddSatStore from "@/stores/addSatStore";

interface Props {
  post: Event | null;
}

export default function Post({ post }: Props) {
  dayjs.extend(relativeTime);

  const { profileEvent, getProfileEvent, setCachedPost, zapReciepts } =
    useEventStore();

  const { additionalSats } = useAddSatStore();

  const [profile, setProfile] = useState<Profile | null>(
    parseProfileContent(getProfileEvent(post?.pubkey || "")?.content),
  );

  useEffect(() => {
    setProfile(
      parseProfileContent(getProfileEvent(post?.pubkey || "")?.content),
    );
  }, [profileEvent]);

  const router = useRouter();

  if (!post) return null;

  const eventPointer: EventPointer = {
    id: post.id,
    author: post.pubkey,
    kind: post.kind,
    // TODO: maybe extend Event type to include relay forund event on
    // maybe seen on would help here
    // relays: post.relays,
  };

  const routeToNewsItem = () => {
    console.log("routeToNewsItem", eventPointer);
    setCachedPost(post);
    router.push(`/${nip19.neventEncode(eventPointer)}`);
  };

  return (
    <div
      key={post.id}
      className="flex items-start justify-start gap-x-2 pb-2 md:items-center"
    >
      <Zap postEvent={post} />
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-x-2">
          <a
            href={getTagValue("u", post.tags) || "#"}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="select-none text-sm dark:text-white"
            // className="text-sm dark:text-white"
          >{`${getTagValue("title", post.tags)}`}</a>
          <Link
            className="text-xs text-blue-500/90 hover:underline dark:text-blue-400/90"
            href={`/from?site=${getTagValue("w", post.tags)}`}
          >
            {getTagValue("w", post.tags)}
          </Link>
        </div>
        <div className="flex items-center gap-x-1">
          <span
            className={`text-[.7rem] font-light ${
              addUpZaps(zapReciepts[post?.id], additionalSats[post?.id] || 0) >
              100
                ? "text-green-500 dark:text-green-400"
                : "text-zinc-500 dark:text-zinc-400"
            }    `}
          >
            {formatSats(addUpZaps(zapReciepts[post?.id], additionalSats[post?.id] || 0))}
          </span>
          <span className="text-[.7rem] font-light text-zinc-500 dark:text-zinc-400">
            /
          </span>
          <span
            onClick={routeToNewsItem}
            className="cursor-pointer text-[.7rem] font-light text-zinc-500 hover:underline dark:text-zinc-400"
          >
            23 comments
          </span>
          <span className="text-[.7rem] font-light text-zinc-500 dark:text-zinc-400">
            /
          </span>
          <span className="cursor-pointer text-[.7rem] font-light text-purple-500/90 hover:underline dark:text-purple-400/90">
            {(profile && (profile.nip05 || profile.name)) ||
              shortenHash(nip19.npubEncode(post.pubkey))}
          </span>
          <span className="text-[.7rem] font-light text-zinc-500 dark:text-zinc-400"></span>
          <span className="text-[.7rem] font-light text-zinc-500 dark:text-zinc-400">
            {dayjs(post.created_at * 1000).fromNow()}
          </span>
          <span className="text-[.7rem] font-light text-zinc-400"></span>
          <Link
            className="cursor-pointer rounded-md bg-zinc-100 px-[.25rem] text-[.6rem] text-zinc-500 hover:ring-1 hover:ring-purple-400/60 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:ring-purple-500/60"
            href={`/tags?tag=${getTagValue("t", post.tags)}`}
          >
            {getTagValue("t", post.tags)}
          </Link>
          <EllipsisHorizontalIcon className="h-4 w-4 cursor-pointer rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
