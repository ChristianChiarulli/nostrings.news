"use client";

import Link from "next/link";

import useLoginStore from "@/stores/loginStore";
import useStore from "@/stores/useStore";

export default function PostButton() {
  const loginStore = useStore(useLoginStore, (state) => state);

  return (
    <>
      {loginStore?.userKeyPair.publicKey ? (
        <Link
          href="/post"
          className="rounded-lg border font-mono px-2 py-1 text-sm dark:border-zinc-700 dark:text-white"
        >
          post
        </Link>
      ) : (
        <></>
      )}
    </>
  );
}
