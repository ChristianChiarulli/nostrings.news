"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Tooltip from "./ToolTip";
import { LongPressCallbackReason, useLongPress } from "use-long-press";
import { BoltIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Event } from "nostr-tools";
import { getZapRecieptFromRelay, sendZap } from "@/lib/nostr";
import type { ZapArgs } from "@/types";
import useRelayStateStore from "@/stores/relayStateStore";
import useEventStore from "@/stores/eventStore";
import useLoginStore from "@/stores/loginStore";
import { Dialog, Transition } from "@headlessui/react";
import { PRESET_AMOUNTS } from "@/lib/constants";
import { Satoshis } from "lnurl-pay/dist/types/types";
import { tw } from "@/lib/utils";
import useAddSatStore from "@/stores/addSatStore";

interface Props {
  postEvent: Event;
  size: string;
}

export default function Zap({ postEvent, size }: Props) {
  // TODO: check if user is logged in
  const { writeRelays } = useRelayStateStore();
  const { getProfileEvent, addZapReciept } = useEventStore();
  const { userKeyPair } = useLoginStore();
  const { additionalSats, setAdditionalSats, clearAdditionalSats } =
    useAddSatStore();

  const [clickCount, setClickCount] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [paymentHash, setPaymentHash] = useState<string | null>(null);
  const [bolt11, setBolt11] = useState<string | null>(null);
  const [_, setCallCount] = useState(0); // State to track the number of calls
  const [buttonDisabled, setButtonDisabled] = useState(false); // State to track the button disabled state
  const [isZapModalOpen, setIsZapModalOpen] = useState(false);
  const [tipInputValue, setTipInputValue] = useState(100);

  const timerRef = useRef<any>(null);
  const intervalRef = useRef<number | undefined>(); // Explicitly typing intervalRef

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 10);
    // setAdditionalSats(postEvent.id, clickCount);
    setIsActive(true);
    setTimeout(() => setIsActive(false), 100); // Change color for 200ms
  };

  useEffect(() => {
    if (clickCount > 10) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        // alert(`Number of clicks: ${clickCount - 10}`);
        // disable button until success or failure
        setButtonDisabled(true);

        setClickCount(10);
        handleSendZap();
      }, 500);
    }

    return () => clearTimeout(timerRef.current);
  }, [clickCount]);

  const handleLongClick = useLongPress(
    () => {
      setButtonDisabled(true);
      setIsZapModalOpen(true);
      setButtonDisabled(false);
    },
    {
      onCancel: (_, { reason }) => {
        if (reason === LongPressCallbackReason.CancelledByRelease) {
          handleClick();
        }
      },
    },
  );

  useEffect(() => {
    // poll the relay for the zap receipt
    if (paymentHash === null || bolt11 === null) {
      return;
    }

    // Reset call count on every paymentHash change
    setCallCount(0);

    // Set an interval to call the function every 2 seconds
    intervalRef.current = window.setInterval(() => {
      const onSuccess = (event: Event) => {
        // alert("Zap received!");
        console.log("Zap received!");
        clearInterval(intervalRef.current);
        setPaymentHash(null);
        setBolt11(null);
        addZapReciept(postEvent.id, event);
        if (additionalSats[postEvent.id] > 0) {
          clearAdditionalSats(postEvent.id);
          console.log("clearing additional sats");
        }
      };

      getZapRecieptFromRelay(postEvent, bolt11, onSuccess);

      // Increment the call count and clear the interval after 5 calls
      setCallCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= 5) {
          clearInterval(intervalRef.current);
        }
        return newCount;
      });
    }, 2000);

    // Clean up the interval when the component unmounts or paymentHash changes
    return () => clearInterval(intervalRef.current);
  }, [paymentHash]);

  const handleSendZap = (e?: React.FormEvent<HTMLFormElement>) => {
    let amount = 0;

    if (e) {
      e.preventDefault();
      amount = tipInputValue;
      // setAdditionalSats(postEvent.id, amount);
    } else {
      amount = clickCount - 10;
    }

    if (amount === 0) {
      alert("Error sending zap! Amount must be greater than 0.");
      return;
    }

    // setAdditionalSats(postEvent.id, amount);

    const zapArgs: ZapArgs = {
      profile: postEvent.pubkey,
      event: postEvent.id,
      amount: amount * 1000,
      relays: writeRelays,
      comment: "nostrings.news zap",
    };

    const onSuccess = (
      paymentResponse: SendPaymentResponse,
      bolt11: string,
    ) => {
      // alert("Zap sent!");
      console.log(paymentResponse);
      console.log("Zap sent!");
      setPaymentHash(paymentResponse.paymentHash);
      setBolt11(bolt11);
      setButtonDisabled(false);
    };

    const onErr = () => {
      alert("Error sending zap!");
      setButtonDisabled(false);
      if (additionalSats[postEvent.id] > 0) {
        clearAdditionalSats(postEvent.id);
        console.log("clearing additional sats");
      }
    };

    // check if user has lud16 in profile
    // if so, send zap to lud16
    // if not, send zap to me
    let profile = null;

    profile = getProfileEvent(postEvent.pubkey);

    if (!profile) {
      alert("Error sending zap! Could not find profile.");
      return;
    }

    sendZap(postEvent, amount, zapArgs, userKeyPair, profile, onSuccess, onErr);
    setIsZapModalOpen(false);
    setTipInputValue(100);
  };

  const iconClass = isActive
    ? tw`h-${size} w-${size} flex-shrink-0 cursor-pointer text-yellow-500`
    : tw`h-${size} w-${size} flex-shrink-0 cursor-pointer text-zinc-400 hover:text-yellow-400 dark:hover:text-yellow-300`;

  return (
    <>
      {buttonDisabled ? (
        <button>
          <BoltIcon className={iconClass} />
        </button>
      ) : (
        <Tooltip
          position="bottom"
          message={`+${clickCount === 10 ? 10 : clickCount - 10} sats`}
        >
          <button {...handleLongClick()}>
            <BoltIcon className={iconClass} />
            {/* <LightningIcon className={iconClass} /> */}
          </button>
        </Tooltip>
      )}

      <Transition.Root show={isZapModalOpen} as={Fragment}>
        <Dialog
          className="fixed z-50"
          open={isZapModalOpen}
          onClose={() => setIsZapModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="fixed w-full max-w-sm -translate-y-1/4 transform rounded-lg bg-zinc-50 p-6 text-base font-semibold text-zinc-900 shadow-xl dark:bg-zinc-900 dark:text-zinc-100 md:max-w-md">
                <button
                  onClick={() => setIsZapModalOpen(false)}
                  className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-600 hover:dark:text-zinc-300"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="flex items-center justify-center text-xl">
                  <Dialog.Title>Zap Post</Dialog.Title>
                </div>

                <form onSubmit={handleSendZap}>
                  <div className="mt-8">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-semibold"
                    >
                      Amount
                    </label>
                    <div className="mt-3 ">
                      <input
                        type="number"
                        value={tipInputValue}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const tipAmount = parseInt(inputValue) as Satoshis;
                          setTipInputValue(tipAmount);
                        }}
                        placeholder="Enter amount in sats"
                        required
                        min={1}
                        className="block w-full rounded-md border-zinc-300 shadow-sm [appearance:textfield] focus:border-purple-300 focus:ring-purple-300 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:border-purple-500 dark:focus:ring-purple-500 sm:py-3 sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />

                      <span className="absolute right-10 -translate-y-9 transform">
                        sats
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-row gap-3">
                    {PRESET_AMOUNTS.map((amount, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-purple-600 px-4 py-2 text-sm font-semibold shadow-md hover:bg-purple-500 hover:font-bold hover:text-white focus:outline-none dark:border-purple-500 dark:hover:bg-purple-500"
                        onClick={() => setTipInputValue(amount.value)}
                      >
                        {amount.label}
                        <BoltIcon className="h-3 w-3" aria-hidden="true" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold"
                    >
                      Message
                    </label>
                    <div className="mt-3">
                      <input
                        type="text"
                        name="message"
                        id="message"
                        placeholder="Optional"
                        className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-purple-300 focus:ring-purple-300 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:border-purple-500 dark:focus:ring-purple-500 sm:py-3 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-2 mt-8">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus:outline-none dark:bg-purple-500 dark:hover:bg-purple-600"
                    >
                      Send Zap
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
