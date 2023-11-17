"use client";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import useLoginStore from "@/stores/loginStore";
import useStore from "@/stores/useStore";
import { useRelayMenuStore } from "@/stores/relayMenuStore";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Event, getEventHash, getSignature } from "nostr-tools";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import SimpleNotification from "../notifications/SimpleNotification";
import useEventStore from "@/stores/eventStore";

interface Props {
  postEvent: Event;
}

export default function PostMenu({ postEvent }: Props) {
  const loginStore = useStore(useLoginStore, (state) => state);

  const { setRelayMenuIsOpen } = useRelayMenuStore();
  const { writeRelays } = useRelayStateStore();
  const { publishPool } = useRelayStore();
  const { removeNewPost, removeSitePost, removeTaggedPost } = useEventStore();

  const [showNotification, setShowNotification] = useState(false);

  const handleRemovePost = async (e: any, close: any) => {
    e.preventDefault();
    if (!loginStore?.userEvent) {
      return;
    }

    let event: Event = {
      id: "",
      sig: "",
      kind: 5,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["e", postEvent.id]],
      content: "",
      pubkey: postEvent.pubkey,
    };

    event.id = getEventHash(event);

    if (loginStore.userKeyPair.secretKey) {
      event.sig = getSignature(event, loginStore.userKeyPair.secretKey);
    } else {
      event = await window.nostr.signEvent(event);
    }

    const onSeen = (event: Event) => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 750);
      removeNewPost(postEvent.id);
      removeSitePost(postEvent.id);
      removeTaggedPost(postEvent.id);
      close();
    };

    publishPool(writeRelays, event, onSeen);
  };

  return (
    <Popover className="relative">
      <Popover.Button className="flex">
        <EllipsisHorizontalIcon className="h-5 w-5 cursor-pointer rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-0 z-10 transform">
          {({ close }) => (
            <div className="min-w-[8rem] shrink rounded-md border border-zinc-200 bg-zinc-50 py-1 text-sm font-semibold leading-6 text-zinc-600/90 shadow-lg ring-1 ring-zinc-200 dark:border-zinc-400/40 dark:bg-zinc-900 dark:text-zinc-300/90 dark:ring-zinc-900/5">
              <Popover.Button
                as="button"
                className="block w-full cursor-pointer select-none py-1 pl-6 text-left hover:bg-zinc-800/40 hover:text-zinc-800 dark:hover:text-zinc-100"
                onClick={() => {
                  setRelayMenuIsOpen(true);
                }}
              >
                copy link
              </Popover.Button>
              <Popover.Button
                as="button"
                className="block w-full cursor-pointer select-none py-1 pl-6 text-left hover:bg-zinc-800/40 hover:text-zinc-800 dark:hover:text-zinc-100"
                // onClick={() => {
                //   setRelayMenuIsOpen(true);
                // }}
              >
                bookmark
              </Popover.Button>
              <div className="border-t border-zinc-200 dark:border-zinc-700/40" />
              <Popover.Button
                as="button"
                className="block w-full cursor-pointer select-none py-1 pl-6 text-left hover:bg-zinc-800/40 hover:text-zinc-800 dark:hover:text-zinc-100"
                onClick={() => {
                  setRelayMenuIsOpen(true);
                }}
              >
                mute
              </Popover.Button>

              {loginStore?.userKeyPair.publicKey === postEvent.pubkey && (
                <Popover.Button
                  as="button"
                  onClick={(e) => handleRemovePost(e, close)}
                  className="block w-full cursor-pointer py-1 pl-6 text-left text-red-400 hover:bg-red-800/10"
                >
                  <p>remove</p>
                </Popover.Button>
              )}
            </div>
          )}
        </Popover.Panel>
      </Transition>
      <SimpleNotification
        title="Post removed"
        message="Your post has been removed."
        show={showNotification}
        setShow={setShowNotification}
      />
    </Popover>
  );
}
