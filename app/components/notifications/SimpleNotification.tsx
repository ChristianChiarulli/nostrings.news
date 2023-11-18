import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

interface Props {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function SimpleNotification({
  type,
  title,
  message,
  show,
  setShow,
}: Props) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 py-6"
    >
      <div className="flex w-full max-w-md flex-col items-center space-y-4">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-[-100%] opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:border dark:border-zinc-400 dark:bg-zinc-900">
            <div className="p-4">
              <div className="flex items-start">
                {type === "success" && (
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                )}
                {type === "error" && (
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                )}
                {type === "warning" && (
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                )}
                {type === "info" && (
                  <div className="flex-shrink-0">
                    <InformationCircleIcon
                      className="h-6 w-6 text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300">
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{message}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-900"
                    onClick={() => setShow(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
