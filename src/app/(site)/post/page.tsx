import { LinkForm } from "~/components/create/LinkForm";
import RandomQuote from "~/components/misc/RandomQuote";
import { NEWS_QUOTES } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { Link2, SatelliteDishIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";

const tabs = [
  { name: "link", icon: Link2 },
  {
    name: "discuss",
    icon: UsersRoundIcon,
  },
  { name: "nostr", icon: SatelliteDishIcon },
  { name: "nostr", icon: SatelliteDishIcon },
  { name: "nostr", icon: SatelliteDishIcon },
  { name: "nostr", icon: SatelliteDishIcon },
  { name: "nostr", icon: SatelliteDishIcon },
  { name: "nostr", icon: SatelliteDishIcon },
  { name: "nostr", icon: SatelliteDishIcon },
  { name: "nostr", icon: SatelliteDishIcon },
];

function getRandomNewsQuote() {
  const randomIndex = Math.floor(Math.random() * NEWS_QUOTES.length);
  return NEWS_QUOTES[randomIndex];
}
const quote = getRandomNewsQuote() ?? "No news is good news.";

export default async function PostPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const selectedTab = searchParams.tab ?? "link";
  return (
    <div className="my-10 px-1.5">
      <RandomQuote quote={quote} />
      <div className="w-full sm:block">
        <div className="border-b border-zinc-200 dark:border-zinc-700">
          <nav
            className="no-scrollbar -mb-px flex space-x-8 overflow-x-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <Link
                replace={true}
                key={tab.name}
                href={`?tab=${tab.name.toLowerCase()}`}
                className={cn(
                  selectedTab === tab.name.toLowerCase()
                    ? "border-purple-500 text-purple-500"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:hover:border-zinc-200 dark:hover:text-zinc-200",
                  "group inline-flex items-center border-b px-1 py-4 text-sm font-medium",
                )}
              >
                <tab.icon
                  className={cn(
                    selectedTab === tab.name.toLowerCase()
                      ? "text-purple-500"
                      : "text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-200",
                    "-ml-0.5 mr-2 h-5 w-5",
                  )}
                />

                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-10 max-w-md">
        {selectedTab === "link" && <LinkForm />}
        {/* {selectedTab === "discuss" && <PostArticle />} */}
        {/* {selectedTab === "nostr" && <PostNostr />} */}
      </div>
    </div>
  );
}
