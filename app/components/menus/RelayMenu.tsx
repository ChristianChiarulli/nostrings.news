"use client";

import { Fragment, useEffect } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

import RelaySettings from "./RelaySettings";
import { useRelayInfoStore } from "@/stores/relayInfoStore";
import { useRelayMenuStore } from "@/stores/relayMenuStore";
import useRelayStateStore from "@/stores/relayStateStore";

export default function RelayMenu() {
  const { relayMenuIsOpen, setRelayMenuIsOpen } = useRelayMenuStore();

  const { allRelays } = useRelayStateStore();

  const { addRelayInfo, getRelayInfo } = useRelayInfoStore();

  useEffect(() => {
    allRelays.forEach((relayUrl) => {
      const cachedRelayInfo = getRelayInfo(relayUrl);
      let relayHttpUrl = relayUrl.replace("wss://", "https://");
      if (cachedRelayInfo === undefined) {
        console.log("Fetching relay info:", relayHttpUrl);
        const getRelayInfo = async (url: string) => {
          try {
            const response = await fetch(url, {
              headers: {
                Accept: "application/nostr+json",
              },
            });
            const data = await response.json();
            addRelayInfo(relayUrl, data);
          } catch (error) {
            console.log("Error fetching relay info:", relayHttpUrl);
            console.error(`Error fetching relay information: ${error}`);
          }
        };
        getRelayInfo(relayHttpUrl);
      } else {
      }
    });
  }, [addRelayInfo, getRelayInfo]);

  return (
    <Transition.Root show={relayMenuIsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setRelayMenuIsOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-zinc-950">
                    <div className="p-[0.625rem]">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Dialog.Title className="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
                            relays
                          </Dialog.Title>
                          <InformationCircleIcon
                            className="h-5 w-5 cursor-pointer text-zinc-400"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md ring-0 outline-none bg-white text-zinc-400 hover:text-zinc-500 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
                            onClick={() => setRelayMenuIsOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-zinc-200 dark:border-zinc-700">
                      <div className="px-6"></div>
                    </div>
                    <RelaySettings />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
