"use client";

import useListEvents from "~/nostr-query/client/hooks/useListEvents";
import { type UseListEventsParams } from "~/nostr-query/types";
import useEventStore from "~/store/event-store";
import { useRelayStore } from "~/store/relay-store";
import { type Event, type Filter } from "nostr-tools";

import Post from "./Post";
import PostLoadButton from "./PostLoadButton";

type Props = {
  initialPosts: Event[];
};

export default function Posts({ initialPosts }: Props) {
  const { newPostEvents, setNewPostEvents } =
    useEventStore();
  const { subRelays } = useRelayStore();

  const filter: Filter = {
    kinds: [1070],
    limit: 5,
  };

  const params: UseListEventsParams = {
    filter: filter,
    relays: subRelays,
    initialEvents: newPostEvents || initialPosts,
    onEventsResolved: (events) => {
      setNewPostEvents(events);
    },
  };

  const { loading, loadOlderEvents } = useListEvents(params);

  async function addMorePosts(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    await loadOlderEvents(newPostEvents, 1);
  }

  return (
    <>
      <ul className="flex flex-col gap-y-2">
        {(newPostEvents.length > 0 ? newPostEvents : initialPosts).map(
          (postEvent, idx) => (
            <Post key={postEvent.id} postEvent={postEvent} index={idx} />
          ),
        )}
      </ul>
      <PostLoadButton
        postsLength={newPostEvents.length}
        loadFn={addMorePosts}
        loading={loading}
      />
    </>
  );
}
