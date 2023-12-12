import { useState } from "react";

import { Skeleton } from "~/components/ui/skeleton";

type Props = {
  pubkey: string;
};

export default function PostProfile({ pubkey }: Props) {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <span className="flex items-center">
        <Skeleton className="h-3 w-[4rem]" />
      </span>
    );
  }

  return (
    <span className="text-xxs cursor-pointer font-light text-purple-500/90 hover:underline dark:text-purple-400/90">
      {/* {pc(profileMap[pubkey]).name} */}
      {"name"}
    </span>
  );
}
