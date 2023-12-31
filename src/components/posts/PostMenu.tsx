import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import usePublishEvent from "~/nostr-query/client/hooks/usePublishEvent";
import { type UsePublishEventParams } from "~/nostr-query/types";
import useEventStore from "~/store/event-store";
import { useRelayStore } from "~/store/relay-store";
import { MoreHorizontal } from "lucide-react";
import { getEventHash, type Event } from "nostr-tools";
import useAuth from "~/hooks/useAuth";

type Props = {
  postEvent: Event | undefined;
};

export default function PostMenu({ postEvent }: Props) {
  const { pubRelays } = useRelayStore();
  const { newPostEvents, setNewPostEvents } = useEventStore();

  const { pubkey } = useAuth();

  const params: UsePublishEventParams = {
    relays: pubRelays,
  };

  const { publishEvent } = usePublishEvent(params);

  async function removePost() {
    if (!pubkey || !postEvent) {
      // TODO: show toast error
      return null;
    }

    const tags = [["e", postEvent.id]];

    let event: Event = {
      kind: 5,
      tags: tags,
      content: "",
      created_at: Math.floor(Date.now() / 1000),
      pubkey: pubkey,
      id: "",
      sig: "",
    };

    event.id = getEventHash(event);
    event = (await nostr.signEvent(event)) as Event;
    const onSeen = (_: Event) => {
      setNewPostEvents(newPostEvents.filter((e) => e.id !== postEvent.id));
    };

    await publishEvent(event, onSeen);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal
          strokeWidth={1}
          className="h-5 w-5 cursor-pointer rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {/* <DropdownMenuItem>bookmark</DropdownMenuItem> */}
        {/* <DropdownMenuItem>copy link</DropdownMenuItem> */}
        {/* <DropdownMenuItem>raw</DropdownMenuItem> */}
        {pubkey === postEvent?.pubkey && (
          <>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={removePost}
              className="dark:text-red-400 dark:focus:bg-red-400/10 dark:focus:text-red-400 "
            >
              remove
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
