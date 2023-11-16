import { XMarkIcon } from "@heroicons/react/24/outline";

interface PropTypes {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export default function SelectedTags({ tags, setTags }: PropTypes) {
  return (
    <div className="flex gap-x-4 overflow-x-auto">
      {tags.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-x-2 rounded-lg border border-purple-500 px-2 py-1 text-sm font-medium text-gray-700 dark:border-purple-600 dark:text-white"
        >
          {tag}
          <button
            onClick={() => {
              setTags(tags.filter((t) => t !== tag));
            }}
          >
            <XMarkIcon
              className="h-4 w-4 rounded-full hover:bg-red-500"
              aria-hidden="true"
            />
          </button>
        </div>
      ))}
    </div>
  );
}
