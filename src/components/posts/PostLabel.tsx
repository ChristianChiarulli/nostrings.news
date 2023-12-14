import useExternalLink from "~/hooks/useExternalLink";
import Link from "next/link";
import { type Event } from "nostr-tools";

type Props = {
  postEvent: Event;
};

export const PostLabel = ({ postEvent }: Props) => {
  const { href, color, label } = useExternalLink(postEvent);

  return (
    <Link
      className={`text-xs hover:underline ${color}`}
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      {label}
    </Link>
  );
};
