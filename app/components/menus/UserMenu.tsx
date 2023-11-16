"use client";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";

import useLoginStore from "@/stores/loginStore";
import useStore from "@/stores/useStore";
import { useRelayMenuStore } from "@/stores/relayMenuStore";

export default function UserMenu({ children }: any) {
  const loginStore = useStore(useLoginStore, (state) => state);

  const { setRelayMenuIsOpen } = useRelayMenuStore();

  const signOut = () => {
    loginStore?.setUserKeyPair({
      publicKey: "",
      secretKey: "",
    });
  };

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-zinc-900 outline-none ring-0">
        {children}
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
        <Popover.Panel className="absolute right-0 z-10 mt-4 flex w-screen max-w-min translate-x-4 px-4">
          <div className="w-48 shrink rounded-md border border-zinc-200 bg-zinc-50 py-2 text-sm font-semibold leading-6 text-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-900/5">
            {[
              {
                // href: `/u/${nip19.npubEncode(userPublicKey)}`,
                href: "#",
                label: "profile",
              },
              {
                href: "/bookmarks",
                label: "bookmarks",
              },
              {
                href: "/settings",
                label: "settings",
              },
            ].map(({ href, label }, idx) => (
              <Popover.Button
                key={idx}
                as={Link}
                href={href}
                className="block select-none px-4 py-1 hover:bg-purple-200 dark:hover:bg-purple-600"
              >
                {label}
              </Popover.Button>
            ))}

            <Popover.Button
              as="button"
              className="block w-full cursor-pointer select-none px-4 py-1 text-left hover:bg-purple-200 dark:hover:bg-purple-600"
              onClick={() => {setRelayMenuIsOpen(true)}}
            >
              relays
            </Popover.Button>
            <div className="mt-2 border-t border-zinc-200 dark:border-zinc-700/40" />
            <Popover.Button
              as="button"
              onClick={signOut}
              className="mt-2 block w-full cursor-pointer px-4 py-1 text-left hover:bg-purple-200 dark:hover:bg-purple-600"
            >
              <p>{"sign out"}</p>
            </Popover.Button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
