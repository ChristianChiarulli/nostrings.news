"use client";

import { useEffect, useState } from "react";
import NewPosts from "@/components/posts/NewPosts";

export default function NoStrings() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-start py-2">
      {mounted && <NewPosts />}
    </main>
  );
}
