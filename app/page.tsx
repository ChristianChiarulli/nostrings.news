import NewPosts from "./components/posts/NewPosts";

export default async function NoStrings() {

  return (
    <main className="flex min-h-screen flex-col items-start py-2">
        <NewPosts />
    </main>
  );
}
