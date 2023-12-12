import Link from "next/link";
import { type Event } from "nostr-tools";
import { tag } from "~/lib/nostr";

type Props = {
  postEvent: Event;
};

export default function PostTag({ postEvent }: Props) {
  return (
    <span className="rounded-xl bg-zinc-100 ml-1 flex items-center px-[.35rem] text-[.6rem] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:ring-purple-500/60">
      {tag("t", postEvent)}
    </span>
  );
}

{/* <Link */}
{/*   className="cursor-pointer rounded-xl bg-zinc-100 ml-1 flex items-center px-[.35rem] text-[.6rem] text-zinc-500 hover:ring-1 hover:ring-purple-400/60 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:ring-purple-500/60" */}
{/*   href={`/tags?tag=${getTag("t", postEvent)}`} */}
{/* > */}
{/*   <span> */}
{/*   {getTag("t", postEvent)} */}
{/*   </span> */}
{/* </Link> */}
