import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

import { POSSIBLE_TAGS } from "@/lib/constants";
import { classNames } from "@/lib/utils";
import { PostArticle, PostLink } from "@/types";

type PropTypes = {
  post: PostLink | PostArticle;
  setPost: (post: any) => void;
};

export default function PostTags({ post, setPost }: PropTypes) {
  const [query, setQuery] = useState("");
  const [blurTimeoutId, setBlurTimeoutId] = useState<number | null>(null);

  const possibleTagsSansAll = POSSIBLE_TAGS.filter((tag) => {
    if (tag === "all") return false;
    if (query === "") return true;
    return tag.toLowerCase().includes(query.toLowerCase());
  });

  const filteredPossibleTags =
    query === ""
      ? possibleTagsSansAll
      : possibleTagsSansAll.filter((tag) => {
          return tag.toLowerCase().includes(query.toLowerCase());
        });

  const handleTagChange = (newTag: string) => {
    const tags = post.tags;
    if (tags.includes(newTag)) {
      // Remove tag if it's already selected
      const newTags = tags.filter((tag) => tag !== newTag);
      setPost({ ...post, tags: newTags });
    } else if (tags.length < 5) {
      // Add new tag if less than 5 are selected
      const newTags = [...tags, newTag];
      setPost({ ...post, tags: newTags });
    } else if (tags.length === 5) {
      alert("You can only select up to 5 tags");
    }
  };

  const handleInputBlur = () => {
    // Clear any existing timeouts
    if (blurTimeoutId) {
      clearTimeout(blurTimeoutId);
      setBlurTimeoutId(null);
    }

    // Set a new timeout
    const newTimeoutId = setTimeout(() => {
      setQuery(""); // Clear the query after a delay
    }, 300) as unknown as number; // Cast the timeout ID to a number

    setBlurTimeoutId(newTimeoutId);
  };

  return (
    <div>
      <Combobox as="div" onChange={handleTagChange}>
        <div className="relative mt-2">
          <Combobox.Input
            displayValue={() => ""}
            // placeholder="Tags"
            name="tags"
            id="tags"
            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            onBlur={handleInputBlur}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-zinc-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredPossibleTags.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800 sm:text-sm">
              {filteredPossibleTags.map((tag) => (
                <Combobox.Option
                  key={tag}
                  value={tag}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-pointer select-none py-2 pl-3 pr-9",
                      active
                        ? "bg-purple-600 text-white"
                        : "text-zinc-900 dark:text-zinc-200",
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          "block truncate",
                          selected ? "font-semibold" : "",
                        )}
                      >
                        {tag}
                      </span>

                      {post.tags.includes(tag) && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-purple-600",
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
}
