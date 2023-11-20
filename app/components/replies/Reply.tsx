import {
  addUpZaps,
  formatSats,
  formatTimeAgo,
  getTagValue,
  parseProfileContent,
  shortHash,
  shortenHash,
} from "@/lib/utils";
import useAddSatStore from "@/stores/addSatStore";
import useEventStore from "@/stores/eventStore";
import { Profile } from "@/types";
import dayjs from "dayjs";
import Link from "next/link";
import { Event, nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

import relativeTime from "dayjs/plugin/relativeTime";
import Zap from "../actions/Zap";

type Props = {
  event: Event;
};

export default function Reply({ event }: Props) {
  console.log("reply", event);
  dayjs.extend(relativeTime);
  const { profileEvent, getProfileEvent, setCachedPost, zapReciepts } =
    useEventStore();

  const { additionalSats } = useAddSatStore();

  const [profile, setProfile] = useState<Profile | null>(
    parseProfileContent(getProfileEvent(event?.pubkey || "")?.content),
  );

  useEffect(() => {
    setProfile(
      parseProfileContent(getProfileEvent(event?.pubkey || "")?.content),
    );
  }, [profileEvent]);

  return (
    <div className="my-2 flex flex-col gap-y-2 rounded-md border-x border-b border-zinc-700 bg-zinc-700/60 dark:text-zinc-100 xs:inline-block xs:border-t xs:px-4 xs:py-4">
      <div className="flex flex-wrap items-center justify-between gap-x-1 rounded-t-md border-t border-zinc-700 bg-zinc-600/50 px-1 xs:justify-start xs:border-none xs:bg-transparent">
        <div className="flex items-center gap-x-1">
          <Zap postEvent={event} size={"4"} />
          <span
            className={`text-[.8rem] font-light ${
              addUpZaps(
                zapReciepts[event?.id],
                additionalSats[event?.id],
              ) > 100
                ? "text-green-500 dark:text-green-400"
                : "text-zinc-500 dark:text-zinc-400"
            }    `}
          >
            {formatSats(
              addUpZaps(zapReciepts[event?.id], additionalSats[event?.id]),
            )}
          </span>
          <span className="text-[.8rem] font-light text-zinc-500 dark:text-zinc-400">
            /
          </span>

          <Link
            href={`/u/${nip19.npubEncode(event.pubkey)}`}
            className="cursor-pointer text-[.8rem] font-light text-purple-500/90 hover:underline dark:text-purple-400/90"
          >
            {/* TODO: check for valid nip05 */}
            {(profile && (profile.nip05 || profile.name)) ||
              shortenHash(nip19.npubEncode(event.pubkey))}
          </Link>
        </div>

        <div className="flex items-center gap-x-1">
          <span className="text-[.8rem] font-light text-zinc-500 dark:text-zinc-400"></span>
          <span className="text-[.8rem] font-light text-zinc-500 dark:text-zinc-400">
            {formatTimeAgo(event.created_at * 1000)}
          </span>
          <span className="text-[.8rem] font-light text-zinc-500 dark:text-zinc-400">
            /
          </span>
          <span className="cursor-pointer font-mono text-[.8rem] font-light text-zinc-600 dark:text-zinc-300">
            id:
            <span className="dark:hover:text-red-400">
              {`${shortHash(event.id)}`}
            </span>
          </span>
        </div>
      </div>
      <div>
        <div className="px-2 py-2">
          {event && getTagValue("image", event.tags) && (
            <img
              className="float-left h-auto max-w-[10rem] pr-4 sm:max-w-[10rem] sm:pl-0"
              // src="https://miro.medium.com/v2/resize:fit:1400/1*qVoszvsqI-E_AFFfQ6oyDw.png"
              // src="https://raw.githubusercontent.com/ChristianChiarulli/colorblender/master/assets/banner.png"
              // src="https://static01.nyt.com/images/2016/09/28/us/28xp-pepefrog/28xp-pepefrog-superJumbo.jpg"
              src={getTagValue("image", event.tags) || ""}
              alt="Image"
            />
          )}

          <span className="text-sm pt-1">{event.content}</span>
        </div>
        {/* <span className="text-[.8rem]"> */}
        {/*   Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit */}
        {/*   enim labore culpa sint ad nisi Lorem pariatur mollit ex esse */}
        {/*   exercitation amet. Nisi anim cupidatat excepteur officia. */}
        {/*   Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate */}
        {/*   voluptate dolor minim nulla est proident. Nostrud officia pariatur ut */}
        {/*   officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit */}
        {/*   commodo officia dolor Lorem duis laboris cupidatat officia voluptate. */}
        {/*   Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis */}
        {/*   officia eiuxsod. Aliqua reprehenderit commodo ex non excepteur duis */}
        {/*   sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea */}
        {/*   consectetur et est culpa et culpa duis. */}
        {/* </span> */}
      </div>
    </div>
  );
}
