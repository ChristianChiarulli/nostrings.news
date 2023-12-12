import { tag } from "~/lib/nostr";
import Link from "next/link";
import { type Event } from "nostr-tools";

type Props = {
  postEvent: Event;
};

export const PostLabel = ({ postEvent }: Props) => {
  return (
    <Link
      className="text-xs text-blue-500/90 hover:underline dark:text-blue-400/90"
      href={tag("u", postEvent) ?? "#"}
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      {tag("w", postEvent)}
    </Link>
  );
};
