import { useEffect, useState } from "react";
import { type Event } from "nostr-tools";
import { Skeleton } from "../ui/skeleton";

type Props = {
  postEvent: Event;
};

export default function PostReplyCount({ postEvent }: Props) {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <span className="flex items-center">
        <Skeleton className="h-3 w-[3rem]" />
      </span>
    );
  }

  return (
    <span className="cursor-pointer text-xxs font-light text-zinc-500 hover:underline dark:text-zinc-400">
      {/* {`${replyEvents?.[postEvent.id]?.length} replies`} */}
      {"replies"}
    </span>
  );
}
