"use client";

import { usePathname } from "next/navigation";
import { Event, Filter, nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

import Post from "@/components/posts/Post";
import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import { EventPointer } from "nostr-tools/lib/types/nip19";
import { getTagValue } from "@/lib/utils";
import ReplyPopover from "@/components/comments/ReplyPopover";
import { cacheProfiles, cacheZapReciepts } from "@/lib/nostr";

export default function NewsItemPage() {
  const { readRelays } = useRelayStateStore();
  const { subscribePool } = useRelayStore();
  const { cachedPost, setCachedPost, zapReciepts } = useEventStore();

  const pathname = usePathname();

  const [post, setPost] = useState<Event | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

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
    function setupMarkdown(content: string) {
      const md = require("markdown-it")();
      const result = md.render(content || "");
      return result;
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
            className="float-left h-auto w-44 px-4 pr-4 sm:w-80 sm:pl-0"
            // src="https://miro.medium.com/v2/resize:fit:1400/1*qVoszvsqI-E_AFFfQ6oyDw.png"
            // src="https://raw.githubusercontent.com/ChristianChiarulli/colorblender/master/assets/banner.png"
            // src="https://static01.nyt.com/images/2016/09/28/us/28xp-pepefrog/28xp-pepefrog-superJumbo.jpg"
            src={(getTagValue("image", post.tags)) || ""}
            alt="Image"
          />
        )}

        {/* Article Text */}
        {post && post.content && (
          <article
            className="prose max-w-none px-4 pb-2 text-sm leading-5 text-zinc-800 dark:prose-invert dark:text-zinc-100 sm:px-0"
            dangerouslySetInnerHTML={{ __html: markdown }}
          />
        )}

        {/* Clear Float */}
        <div className="clear-both"></div>
      </div>

      {/* Other Content */}
      <div className="mt-4 flex w-full justify-start gap-x-2 px-4 sm:px-0">
        {post && (
          <ReplyPopover
            open={showCommentModal}
            setOpen={setShowCommentModal}
            post={post}
          >
            <button
              onClick={() => setShowCommentModal(true)}
              className="rounded-lg border dark:border-zinc-700 border-zinc-300 shadow-lg shadow-black/5 px-2 py-1 font-mono text-zinc-600 hover:text-zinc-500 dark:text-zinc-200 dark:hover:text-zinc-100"
            >
              reply
            </button>
          </ReplyPopover>
        )}

        <button className="rounded-lg border dark:border-zinc-700 border-zinc-300 shadow-lg shadow-black/5 px-2 py-1 font-mono text-zinc-600 hover:text-zinc-500 dark:text-zinc-200 dark:hover:text-zinc-100">
          bookmark
        </button>
      </div>
    </div>
  );
}
