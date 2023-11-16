import TagPosts from "@/components/posts/TagPosts";

export default async function NoStrings() {
  return (
    <main className="flex min-h-screen flex-col items-start py-2">
      <TagPosts />
    </main>
  );
}
