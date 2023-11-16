"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PostFilter() {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("filter") || "",
  );
  const router = useRouter();

  // Effect to update local state when URL search params change
  useEffect(() => {
    const filterValue = searchParams.get("filter") || "";
    setInputValue(filterValue);
  }, [searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Update local state
    const tagValue = searchParams.get("tag") || "";
    const siteValue = searchParams.get("site") || "";

    if (siteValue) {
      router.push(`?site=${siteValue}&filter=${value}`); // Update URL
      return;
    }

    if (tagValue) {
      router.push(`?tag=${tagValue}&filter=${value}`); // Update URL
      return;
    }

    router.push(`?filter=${value}`); // Update URL
  };

  return (
    <input
      type="text"
      placeholder="filter posts..."
      onChange={handleFilterChange}
      value={inputValue}
      className="w-28 placeholder:text-zinc-400 dark:placeholder:text-zinc-500/80 rounded-lg border-0 bg-white p-0 ml-1 pl-2 text-xs text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-1 focus:ring-inset focus:ring-purple-600/90 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700 dark:focus:ring-purple-500/90 sm:text-sm sm:leading-6"
    />
  );
}
