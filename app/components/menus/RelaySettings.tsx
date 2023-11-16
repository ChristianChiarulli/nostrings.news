import { Fragment } from "react";

import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

import { useRelayInfoStore } from "../../stores/relayInfoStore";
import RelayIcon from "./RelayIcon";
import useRelayStateStore from "@/stores/relayStateStore";
import { classNames } from "@/lib/utils";
import useEventStore from "@/stores/eventStore";
import useLoginStore from "@/stores/loginStore";

export default function RelaySettings() {
  const { getRelayInfo } = useRelayInfoStore();

  const {
    allRelays,
    readRelays,
    addReadRelay,
    removeReadRelay,
    writeRelays,
    addWriteRelay,
    removeWriteRelay,
  } = useRelayStateStore();

  const { clearAllEvents } = useEventStore();
  const { setUserEvent } = useLoginStore();


  const handleAddReadRelay = (readRelay: string) => {
    console.log("Setting read relay");
    addReadRelay(readRelay);
    clearAllEvents();
    setUserEvent(null);
  };

  const handleRemoveReadRelay = (readRelay: string) => {
    console.log("Setting read relay");

    if (readRelays.length === 1) {
      alert("You must have at least one read relay.");
      return;
    }

    removeReadRelay(readRelay);
    clearAllEvents();
    setUserEvent(null);
  };

  const handleAddWriteRelay = (postRelay: string) => {
    console.log("Setting post relay");
    addWriteRelay(postRelay);
  };

  const handleRemoveWriteRelay = (postRelay: string) => {
    console.log("Setting post relay");

    if (writeRelays.length === 1) {
      alert("You must have at least one post relay.");
      return;
    }
    removeWriteRelay(postRelay);
  };

  return (
    <>
      {/* <p className="bg-zinc-50 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-300"> */}
      {/*   <p className="bg-purple-700/10 px-4 py-2"> */}
      {/*     Determine what each relay will be used for */}
      {/*   </p> */}
      {/* </p> */}
      <ul
        role="list"
        className="flex-1 divide-y divide-zinc-200 overflow-y-auto dark:divide-zinc-700"
      >
        {allRelays.map((relay) => (
          <li key={relay}>
            <div className="group relative flex items-center px-5 py-6">
              <div className="-m-1 block flex-1 p-1">
                <div className="absolute inset-0" aria-hidden="true" />
                <div className="relative flex min-w-0 flex-1 items-center">
                  <span className="relative inline-block flex-shrink-0">
                    <RelayIcon
                      src={
                        relay
                          .replace("wss://", "https://")
                          .replace("relay.", "") + "/favicon.ico"
                      }
                      fallback="https://user-images.githubusercontent.com/29136904/244441447-d6f64435-6155-4ffa-8574-fb221a3ad412.png"
                      alt=""
                    />
                  </span>
                  <div className="ml-4 truncate">
                    {getRelayInfo(relay) && (
                      <>
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {getRelayInfo(relay).name}
                        </p>
                        <p className="truncate text-sm text-zinc-500">
                          {getRelayInfo(relay).contact}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                {readRelays.includes(relay) ? (
                  <button
                    onClick={() => handleRemoveReadRelay(relay)}
                    className="z-20 inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/30 hover:ring-green-600/60 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20 dark:hover:ring-green-500/50"
                  >
                    Read
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddReadRelay(relay)}
                    className="z-20 inline-flex items-center rounded-md bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/20 hover:ring-zinc-500/40 dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20 dark:hover:ring-zinc-400/50"
                  >
                    Read
                  </button>
                )}

                {writeRelays.includes(relay) ? (
                  <button
                    onClick={() => handleRemoveWriteRelay(relay)}
                    className="z-20 inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/30 hover:ring-green-600/60 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20 dark:hover:ring-green-500/50"
                  >
                    Post
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddWriteRelay(relay)}
                    className="z-20 inline-flex items-center rounded-md bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/20 hover:ring-zinc-500/40 dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20 dark:hover:ring-zinc-400/50"
                  >
                    Post
                  </button>
                )}
              </div>

              <Menu
                as="div"
                className="relative z-40 ml-2 inline-block flex-shrink-0 text-left"
              >
                <Menu.Button className="group relative inline-flex h-8 w-8 items-center justify-center focus:outline-none">
                  <span className="sr-only">Open options menu</span>
                  <span className="flex h-full w-full items-center justify-center rounded-full">
                    <EllipsisVerticalIcon
                      className="h-5 w-5 text-zinc-400 dark:text-zinc-300 dark:hover:text-zinc-200"
                      aria-hidden="true"
                    />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-9 top-0 z-10 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-600">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                                : "text-zinc-700 dark:text-zinc-200",
                              "block px-4 py-2 text-sm",
                            )}
                          >
                            Relay Info
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            // onClick={() => handleRemoveRelay(relay.url)}
                            className={classNames(
                              active
                                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-red-500"
                                : "text-zinc-700 dark:text-zinc-200",
                              "block w-full px-4 py-2 text-start text-sm",
                            )}
                          >
                            Remove Relay
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
