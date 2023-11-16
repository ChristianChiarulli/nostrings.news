"use client";

import useRandomQuoteStore from "@/stores/randomQuoteStore";
import useStore from "@/stores/useStore";

export default function RandomQuote() {
  const randomQuoteStore = useStore(useRandomQuoteStore, (state) => state);

  return (
    <>
      {randomQuoteStore?.randomQuote ? (
        <h1 className=" mb-8 text-lg font-bold text-zinc-700 dark:text-zinc-400">
          {`"${randomQuoteStore?.randomQuote}"`}
        </h1>
      ) : (
        <h1 className=" mb-8 text-xl font-bold text-white dark:text-zinc-900">
          {"Loading..."}
        </h1>
      )}
    </>
  );
}
