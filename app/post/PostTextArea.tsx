import { Tab } from "@headlessui/react";

import { classNames } from "@/lib/utils";

interface PropTypes {
  text: string;
  setText: (text: string) => void;
  titleWarning?: boolean;
}

export default function PostTextArea({
  text,
  setText,
  titleWarning = false,
}: PropTypes) {
  function setupMarkdown(content: string) {
    const md = require("markdown-it")();
    const result = md.render(content || "");
    return result;
  }

  const markdown = setupMarkdown(text);

  return (
    <div>
      <Tab.Group>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="flex items-center">
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                      : "bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
                    "rounded-md border border-transparent px-3 py-1.5 text-sm font-medium",
                  )
                }
              >
                write
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                      : "bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
                    "ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium",
                  )
                }
              >
                preview
              </Tab>

              {titleWarning && (
                <label
                  htmlFor="text"
                  className="block pl-4 text-xs font-medium leading-6 text-zinc-600 dark:text-zinc-500"
                >
                  (don't add your title here)
                </label>
              )}

              {selectedIndex === 0 ? (
                <div className="ml-auto flex items-center space-x-5">
                  <div className="flex items-center">
                    <a
                      className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-200"
                      href="https://guides.github.com/features/mastering-markdown/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        className="h-7 w-7"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m16 15l3-3l-1.05-1.075l-1.2 1.2V9h-1.5v3.125l-1.2-1.2L13 12l3 3ZM4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm0-2h16V6H4v12Zm0 0V6v12Zm1.5-3H7v-4.5h1v3h1.5v-3h1V15H12v-5q0-.425-.288-.713T11 9H6.5q-.425 0-.713.288T5.5 10v5Z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ) : null}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                <label htmlFor="comment" className="sr-only">
                  Comment
                </label>
                <div>
                  <textarea
                    rows={5}
                    name="comment"
                    id="comment"
                    onChange={(event) => setText(event.target.value)}
                    value={text}
                    className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                <div className="border-b dark:border-zinc-700">
                  <article
                    className="prose mx-px mt-px px-3 pb-12 pt-2 text-sm leading-5 text-zinc-800 dark:prose-invert dark:text-zinc-100"
                    dangerouslySetInnerHTML={{ __html: markdown }}
                  />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
    </div>
  );
}
