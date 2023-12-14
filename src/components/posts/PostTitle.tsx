import { tag } from "~/lib/nostr";
import Link from "next/link";
import { type Event } from "nostr-tools";
import useExternalLink from "~/hooks/useExternalLink";

type Props = {
  postEvent: Event;
};

export const PostTitle = ({ postEvent }: Props) => {
  const { href } = useExternalLink(postEvent);
  return (
    <Link
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      <h3 className="text-sm">{tag("title", postEvent)}</h3>
    </Link>
  );
};
