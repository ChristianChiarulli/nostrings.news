"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Event, nip19 } from "nostr-tools";
import { AddressPointer, EventPointer } from "nostr-tools/lib/types/nip19";
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

interface Props {
  article: Event;
}

export default function Article({ article }: Props) {
  dayjs.extend(relativeTime);

  const { profileEvent, getProfileEvent, setCachedPost, zapReciepts } =
    useEventStore();

  const { additionalSats } = useAddSatStore();

  const [profile, setProfile] = useState<Profile | null>(
    parseProfileContent(getProfileEvent(article?.pubkey || "")?.content),
  );

  useEffect(() => {
    setProfile(
      parseProfileContent(getProfileEvent(article?.pubkey || "")?.content),
    );
  }, [profileEvent]);

  function setupMarkdown(content: string) {
    const md = require("markdown-it")();
    const result = md.render(content || "");
    return result;
  }

  const image = getTagValue("image", article.tags) || "";

  console.log("image", image);

  const markdown = setupMarkdown(
    `![cover image](${image}) \n` + article.content,
  );

  return (
    <div className="text-lg text-white">
      <article
        className="prose mx-px mt-px px-3 pb-12 pt-2 text-sm leading-5 text-zinc-800 dark:prose-invert dark:text-zinc-100"
        dangerouslySetInnerHTML={{ __html: markdown }}
      />
      {/* <article>{article.content}</article> */}
    </div>
  );
}
