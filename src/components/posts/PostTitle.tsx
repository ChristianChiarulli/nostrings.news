import { tag } from "~/lib/nostr";
import Link from "next/link";
import { type Event } from "nostr-tools";

type Props = {
  postEvent: Event;
};

export const PostTitle = ({ postEvent }: Props) => {
  return (
    <Link
      href={tag("u", postEvent) ?? "#"}
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      <h3 className="text-sm">{tag("title", postEvent)}</h3>
    </Link>
  );
};
