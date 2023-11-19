import {
  GlobeAltIcon,
  LinkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { classNames } from "@/lib/utils";

const PostArticle = dynamic(() => import("./PostArticle"), { ssr: false });
const PostLink = dynamic(() => import("./PostLink"), { ssr: false });
import PostNostr from "./PostNostr";
import RandomQuote from "./RandomQuote";
import dynamic from "next/dynamic";

const tabs = [
  { name: "link", href: "#", icon: LinkIcon },
  {
    name: "discuss",
    href: "#",
    icon: UserGroupIcon,
  },
  { name: "nostr", href: "#", icon: GlobeAltIcon },
];

export default async function PostPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const selectedTab = searchParams.tab || "link";
  return (
    <div className="my-10 px-1.5">
      <RandomQuote />
      <div className="w-full max-w-md sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full cursor-pointer rounded-md border-zinc-300 focus:border-purple-500 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          defaultValue={"Link"}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden w-full sm:block">
        <div className="border-b border-zinc-200 dark:border-zinc-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                replace={true}
                key={tab.name}
                href={`?tab=${tab.name.toLowerCase()}`}
                className={classNames(
                  selectedTab === tab.name.toLowerCase()
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:hover:border-zinc-200 dark:hover:text-zinc-200",
                  "group inline-flex items-center border-b px-1 py-4 text-sm font-medium",
                )}
                // aria-current={tab.current ? "page" : undefined}
              >
                <tab.icon
                  className={classNames(
                    selectedTab === tab.name.toLowerCase()
                      ? "text-purple-500"
                      : "text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-200",
                    "-ml-0.5 mr-2 h-5 w-5",
                  )}
                  aria-hidden="true"
                />

                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-10">
        {selectedTab === "link" && <PostLink />}
        {selectedTab === "discuss" && <PostArticle />}
        {selectedTab === "nostr" && <PostNostr />}
      </div>
    </div>
  );
}
