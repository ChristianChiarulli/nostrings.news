"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Event, nip19 } from "nostr-tools";
import { EventPointer } from "nostr-tools/lib/types/nip19";
import "nprogress/nprogress.css";

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
import PostMenu from "../menus/PostMenu";

// const kind = getTagValue("k", event.tags);
// const atag = getTagValue("a", event.tags);
// const dtag = atag?.split(":")[2];
// const pubkey = atag?.split(":")[1];
//
// const articleFilter: Filter = {
//   kinds: [Number(kind)],
//   limit: 1,
//   authors: [pubkey as string],
//   "#d": [dtag as string],
// };
//
// const onArticleEvent = (event: Event) => {
//   console.log("article event", event);
//   setArticle(event);
// };
//
// subscribePool(readRelays, articleFilter, onArticleEvent, () => {});

interface Props {
  post: Event;
}

export default function Post({ post }: Props) {
  dayjs.extend(relativeTime);

  const {
    profileEvent,
    getProfileEvent,
    setCachedPost,
    zapReciepts,
    replyEvents,
  } = useEventStore();

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

  // if (!post) return null;

  const eventPointer: EventPointer = {
    id: post.id,
    author: post.pubkey,
    kind: post.kind,
    // TODO: maybe extend Event type to include relay forund event on
    // onseen may help here
    // maybe seen on would help here
    // relays: post.relays,
  };

  const routeToNewsItem = () => {
    console.log("routeToNewsItem", eventPointer);
    setCachedPost(post);
    router.push(`/${nip19.neventEncode(eventPointer)}`);
  };

  const setLabel = (post: Event) => {
    if (getTagValue("w", post.tags)) {
      return (
        <a
          className="text-xs text-blue-500/90 hover:underline dark:text-blue-400/90"
          // href={`/from?site=${getTagValue("w", post.tags)}`}
          href={getTagValue("u", post.tags) || "#"}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {getTagValue("w", post.tags)}
        </a>
      );
    }

    if (getTagValue("k", post.tags)) {
      const kind = getTagValue("k", post.tags);
      // construct naddr
      // get atag make naddr
      // link to blogstack
      let href = "";
      let label = "";
      if (kind === "30023") {
        label = "blogstack.io";
        href = `/article/${nip19.neventEncode(eventPointer)}`;
      }

      return (
        <a
          className="text-xs text-blue-500/90 hover:underline dark:text-blue-400/90"
          href={getTagValue("u", post.tags) || "#"}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {label}
        </a>
      );
    }

    if (post.content) {
      return null;
    }
  };

  return (
    <div
      key={post.id}
      className="flex items-start justify-start gap-x-2 pb-2 md:items-center"
    >
      <Zap postEvent={post} size="6" />
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-x-2 sm:flex-row sm:flex-wrap">
          {getTagValue("u", post.tags) ? (
            <span>
              <span
                // href={getTagValue("u", post.tags) || "#"}
                // target="_blank"
                // rel="nofollow noopener noreferrer"
                onClick={routeToNewsItem}
                className="select-none text-sm dark:text-white"
              >{`${getTagValue("title", post.tags)}`}</span>
            </span>
          ) : (
            <span
              onClick={routeToNewsItem}
              className="cursor-pointer select-none text-sm dark:text-white"
              // className="text-sm dark:text-white"
            >{`${getTagValue("title", post.tags)}`}</span>
          )}
          <span>{setLabel(post)}</span>
          {/* <Link */}
          {/*   className="text-xs text-blue-500/90 hover:underline dark:text-blue-400/90" */}
          {/*   href={`/from?site=${getTagValue("w", post.tags)}`} */}
          {/* > */}
          {/*   {getTagValue("w", post.tags)} */}
          {/* </Link> */}
        </div>
        <div className="flex flex-wrap items-center gap-x-1">
          <span
            className={`text-[.7rem] font-light ${
              addUpZaps(zapReciepts[post?.id], additionalSats[post?.id]) > 100
                ? "text-green-500 dark:text-green-400"
                : "text-zinc-500 dark:text-zinc-400"
            }    `}
          >
            {formatSats(
              addUpZaps(zapReciepts[post?.id], additionalSats[post?.id]),
            )}{" "}
            {" sats"}
          </span>
          <span className="text-[.7rem] font-light text-zinc-500 dark:text-zinc-400">
            /
          </span>
          <span
            onClick={routeToNewsItem}
            className="cursor-pointer text-[.7rem] font-light text-zinc-500 hover:underline dark:text-zinc-400"
          >
            {`${
              (post && replyEvents[post.id] && replyEvents[post.id].length) || 0
            } replies`}
          </span>
          <span className="text-[.7rem] font-light text-zinc-500 dark:text-zinc-400">
            /
          </span>
          <Link
            href={`/u/${nip19.npubEncode(post.pubkey)}`}
            className="cursor-pointer text-[.7rem] font-light text-purple-500/90 hover:underline dark:text-purple-400/90"
          >
            {/* TODO: check for valid nip05 */}
            {(profile && (profile.nip05 || profile.name)) ||
              shortenHash(nip19.npubEncode(post.pubkey))}
          </Link>
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
          <PostMenu postEvent={post} />
        </div>
      </div>
    </div>
  );
}
