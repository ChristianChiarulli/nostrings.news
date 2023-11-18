import { PostArticle, PostLink } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";

type PropTypes = {
  post: PostLink | PostArticle;
  setPost: (post: any) => void;
};

export default function SelectedTags({ post, setPost }: PropTypes) {
  return (
    <div className="flex gap-x-4 overflow-x-auto">
      {post.tags.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-x-2 rounded-lg border border-purple-500 px-2 py-1 text-sm font-medium text-gray-700 dark:border-purple-600 dark:text-white"
        >
          {tag}
          <button
            onClick={() => {
              setPost({ ...post, tags: post.tags.filter((t) => t !== tag) });
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
