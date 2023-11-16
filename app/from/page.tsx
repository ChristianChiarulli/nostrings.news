import SitePosts from "@/components/posts/SitePosts";

export default async function NoStrings() {
  return (
    <main className="flex min-h-screen flex-col items-start py-2">
      <SitePosts />
    </main>
  );
}

