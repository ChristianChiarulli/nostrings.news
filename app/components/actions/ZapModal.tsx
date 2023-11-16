import { Dialog, Transition } from "@headlessui/react";
import { BoltIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

export default function ZapModal() {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        className="fixed z-50"
        open={isOpen}
        onClose={() => setIsOpen(false)}
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
            <Dialog.Panel className="fixed w-full max-w-sm -translate-y-1/4 transform rounded-lg bg-slate-50 p-6 text-base font-semibold text-slate-900 shadow-xl dark:bg-slate-800 dark:text-slate-100 md:max-w-md">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-600 hover:dark:text-slate-300"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="flex items-center justify-center text-xl">
                <Dialog.Title>Lightning Tip</Dialog.Title>
              </div>

              <form onSubmit={handleSendTip}>
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
                      className="block w-full rounded-md border-slate-300 shadow-sm [appearance:textfield] focus:border-purple-300 focus:ring-purple-300 dark:border-slate-600 dark:bg-slate-800 dark:focus:border-orange-400 dark:focus:ring-orange-400 sm:py-3 sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-purple-600 px-4 py-2 text-sm font-semibold shadow-md hover:bg-purple-500 hover:font-bold hover:text-white focus:outline-none dark:border-orange-400 dark:hover:bg-orange-500"
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
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-purple-300 focus:ring-purple-300 dark:border-slate-600 dark:bg-slate-800 dark:focus:border-orange-400 dark:focus:ring-orange-400 sm:py-3 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mb-2 mt-8">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus:outline-none dark:bg-orange-500 dark:hover:bg-orange-600"
                  >
                    Send Tip
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
