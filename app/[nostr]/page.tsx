"use client";

import { usePathname } from "next/navigation";
import { Event, Filter, nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

import DOMPurify from "dompurify";

import Post from "@/components/posts/Post";
import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import { EventPointer } from "nostr-tools/lib/types/nip19";
import { getTagValue, shortHash } from "@/lib/utils";
import { cacheProfiles, cacheZapReciepts } from "@/lib/nostr";
import dynamic from "next/dynamic";
import useReplyStore from "@/stores/replyStore";
import Replies from "@/components/replies/Replies";

const ReplyPopover = dynamic(
  () => import("@/components/replies/ReplyPopover"),
  { ssr: false },
);

export default function NewsItemPage() {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { cachedPost, setCachedPost, zapReciepts } = useEventStore();
  const { clearReply } = useReplyStore();

  const pathname = usePathname();

  const [post, setPost] = useState<Event | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      clearReply();
    };
  }, []);

  let nevent: string | null = null;
  if (pathname) {
    nevent = pathname.split("/").pop() || null;
  }

  useEffect(() => {
    if (cachedPost) {
      setPost(cachedPost);
      setCachedPost(null);
      return;
    }

    if (!nevent) {
      return;
    }

    const neventData = nip19.decode(nevent).data as EventPointer;
    const neventFilter: Filter = {
      kinds: [1070],
      limit: 1,
      authors: [neventData.author as string],
      ids: [neventData.id],
    };

    const pubkeys = new Set<string>();

    const onEvent = (event: Event) => {
      console.log("event", event);
      setPost(event);
      if (!pubkeys.has(event.pubkey)) {
        cacheProfiles([event.pubkey]);
      }
      if (!zapReciepts[event.id]) {
        cacheZapReciepts(event.id);
      }

      pubkeys.add(event.pubkey);
    };

    subscribePool(readRelays, neventFilter, onEvent, () => {});
  }, [readRelays]);

  useEffect(() => {
    if (!post) {
      return;
    }

    console.log("post", post);

    // Function to convert YouTube URLs to embeds
    function convertYouTubeLinksToEmbeds(html: string) {
      const youtubeRegex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/g;

      return html.replace(
        youtubeRegex,
        `<div class="youtube-container"><iframe src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>`,
      );
    }

    function setupMarkdown(content: string) {
      const md = require("markdown-it")();
      let html = md.render(content);
      // html = convertYouTubeLinksToEmbeds(html);
      // html = DOMPurify.sanitize(html);
      return html;
    }
    const markdown = setupMarkdown(post.content);
    setMarkdown(markdown);
  }, [post]);

  return (
    <div className="flex min-h-screen w-full flex-col items-start py-2">
      {/* Post Component */}
      {post && <Post post={post} />}

      {/* Main Content */}
      <div className="w-full">
        {/* Float Image to the Left */}
        {post && getTagValue("image", post.tags) && (
          <img
            className="float-left h-auto max-w-[10rem] pr-4 sm:max-w-[16rem] sm:pl-0"
            // src="https://miro.medium.com/v2/resize:fit:1400/1*qVoszvsqI-E_AFFfQ6oyDw.png"
            // src="https://raw.githubusercontent.com/ChristianChiarulli/colorblender/master/assets/banner.png"
            // src="https://static01.nyt.com/images/2016/09/28/us/28xp-pepefrog/28xp-pepefrog-superJumbo.jpg"
            src={getTagValue("image", post.tags) || ""}
            alt="Image"
          />
        )}

        {/* Article Text */}
        {post && post.content && (
          <article
            // className="prose whitespace-break-spaces max-w-none px-4 pb-2 text-sm leading-5 text-zinc-800 dark:prose-invert dark:text-zinc-100 sm:px-0"
            className="prose max-w-none pb-2 text-sm leading-5 text-zinc-800 dark:prose-invert dark:text-zinc-100 sm:px-0"
            dangerouslySetInnerHTML={{ __html: markdown }}
          />
        )}
        {/* Clear Float */}
        <div className="clear-both"></div>
      </div>

      {/* Other Content */}
      <div className="mt-4 flex w-full justify-between">
        <div className="flex w-full justify-start gap-x-2 sm:px-0">
          {post && (
            <ReplyPopover
              open={showCommentModal}
              setOpen={setShowCommentModal}
              event={post}
            >
              <button
                onClick={() => setShowCommentModal(true)}
                className="whitespace-normal rounded-lg border border-zinc-300 px-2 py-1 font-mono text-sm text-zinc-600 shadow-lg shadow-black/5 hover:text-zinc-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-zinc-100"
              >
                reply
              </button>
            </ReplyPopover>
          )}

          <button className="rounded-lg border border-zinc-300 px-2 py-1 font-mono text-sm text-zinc-600 shadow-lg shadow-black/5 hover:text-zinc-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-zinc-100">
            bookmark
          </button>
        </div>
        <button className="rounded-lg px-2 py-1 font-mono text-sm text-zinc-600 shadow-lg shadow-black/5 hover:text-zinc-500 dark:text-zinc-200 dark:hover:text-zinc-100">
          id:
          <span className="dark:hover:text-red-400">
            {`${shortHash((post && post.id) || "")}`}
          </span>
        </button>
      </div>
      <div className="mt-8 justify-start gap-x-2 sm:px-0">
        {post && <Replies event={post} />}
      </div>
    </div>
  );
}
