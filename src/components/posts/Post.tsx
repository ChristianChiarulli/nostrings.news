import { type Event } from "nostr-tools";
import { tag } from "~/lib/nostr";
import { PostLabel } from "./PostLabel";
import PostSatCount from "./PostSatCount";
import PostReplyCount from "./PostReplyCount";
import PostProfile from "./PostProfile";
import PostDate from "./PostDate";
import PostTag from "./PostTag";
import PostMenu from "./PostMenu";
import { Zap } from "../zap/Zap";
import { PostTitle } from "./PostTitle";
// import { Zap } from "../lightning/zap";

type Props = {
  postEvent: Event;
  index: number;
};

function Divider() {
  return (
    <span className="text-xxs font-light text-zinc-500 dark:text-zinc-400">
      /
    </span>
  );
}

export default function Post({ postEvent, index }: Props) {
  return (
    <li className="flex items-start gap-x-1.5">
      {/* <Zap /> */}
      <span className="text-lg p-2 font-light text-zinc-500 dark:text-zinc-400">
        {index + 1}
      </span>
      <div className="flex flex-col gap-y-0.5">
        <div className="flex flex-wrap items-center gap-x-2">
          <PostTitle postEvent={postEvent} />
          <PostLabel postEvent={postEvent} />
        </div>
        <span className="flex gap-x-1">
          {/* <PostSatCount /> */}
          {/* <Divider /> */}
          {/* <PostReplyCount postEvent={postEvent} /> */}
          {/* <Divider /> */}
          <PostProfile pubkey={postEvent.pubkey} />
          <PostDate createdAt={postEvent.created_at} />
          <PostTag postEvent={postEvent} />
          <PostMenu postEvent={postEvent} />
        </span>
      </div>
    </li>
  );
}
