import { fromNow } from "~/lib/utils";

type Props = {
  createdAt: number;
};

export default function PostDate({ createdAt }: Props) {
  return (
    <span className="text-xxs pl-1 font-light text-zinc-500 dark:text-zinc-400">
      {fromNow(createdAt) ?? "unknown"}
    </span>
  );
}
