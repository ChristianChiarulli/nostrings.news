"use client";

import { useRouter } from "next/navigation";
import { Event, getEventHash, getSignature } from "nostr-tools";

import { PostArticle } from "@/types";
import useLoginStore from "@/stores/loginStore";
import usePostStore from "@/stores/postStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import useStore from "@/stores/useStore";

import PostTags from "./PostTags";
import PostTextArea from "./PostTextArea";
import SelectedTags from "./SelectedTags";
import useEventStore from "@/stores/eventStore";

export default function PostArticle() {
  // const loginStore = useStore(useLoginStore, (state) => state);
  const loginStore = useLoginStore();

  const { postArticle, setPostArticle, clearPostArticle } = usePostStore();
  const { writeRelays } = useRelayStateStore();
  const { publishPool } = useRelayStore();
  const { clearAllEvents } = useEventStore();

  const router = useRouter();

  // if (!loginStore) {
  //   return <div className="min-h-screen">login first</div>;
  // }

  const validateBeforePublish = () => {
    if (postArticle.title === "") {
      alert("title cannot be empty");
      return false;
    }

    if (postArticle.tags.length === 0) {
      alert("choose at least one tag");
      return false;
    }

    return true;
  };

  const handlePublish = async (e: any) => {
    e.preventDefault();
    console.log("publishing article");
    console.log(postArticle);

    if (!validateBeforePublish()) {
      return;
    }

    if (!loginStore?.userKeyPair) {
      alert("login first");
      return;
    }

    const publicKey = loginStore.userKeyPair.publicKey || "";
    const secretKey = loginStore.userKeyPair.secretKey || "";

    const title = postArticle.title;
    const image = postArticle.image;
    const text = postArticle.text;
    const tags = postArticle.tags;

    const newsTags = [["title", title]];

    if (image) {
      newsTags.push(["image", image]);
    }

    tags.forEach((tag) => {
      newsTags.push(["t", tag]);
    });

    let newsEvent: Event = {
      id: "",
      sig: "",
      kind: 1070,
      created_at: Math.floor(Date.now() / 1000),
      tags: newsTags,
      content: text,
      pubkey: publicKey,
    };

    newsEvent.id = getEventHash(newsEvent);
    if (secretKey) {
      newsEvent.sig = getSignature(newsEvent, secretKey);
    } else {
      newsEvent = await window.nostr.signEvent(newsEvent);
    }

    const onNewsEventSeen = (event: Event) => {
      console.log("news event", event);
      clearPostArticle();
      // TODO:
      // if there are events cached then add the new event to the cache
      // if there are no events cached then clear the cache and route
      // for now we'll just clear the cache and route
      clearAllEvents();
      router.push("/new");
    };

    publishPool(writeRelays, newsEvent, onNewsEventSeen);
  };

  return (
    <div className="flex flex-col justify-start space-y-6">
      <div className="max-w-lg">
        <label
          htmlFor="title"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          title
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="title"
            id="title"
            value={postArticle.title}
            onChange={(e) => {
              setPostArticle({
                ...postArticle,
                title: e.target.value,
              });
            }}
            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
            aria-describedby="title"
          />
        </div>
        {postArticle.title !== "" ? (
          <div>
            {80 - postArticle.title.length >= 0 ||
            postArticle.title.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {80 - postArticle.title.length} characters remaining
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                maximum title length exceeded by
                {postArticle.title.length && postArticle.title.length - 80}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            80 characters remaining
          </p>
        )}
      </div>

      <div className="max-w-lg">
        <label
          htmlFor="image"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          image
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="image"
            id="image"
            value={postArticle.image}
            onChange={(e) => {
              setPostArticle({
                ...postArticle,
                image: e.target.value,
              });
            }}
            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
            aria-describedby="image url"
          />
        </div>
      </div>

      <div className="max-w-lg">
        <label
          htmlFor="title"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          content
        </label>

        <PostTextArea
          post={postArticle}
          setPost={setPostArticle}
          titleWarning={true}
        />
      </div>

      <div className="max-w-lg">
        <label
          htmlFor="tags"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          tags
        </label>
        <PostTags post={postArticle} setPost={setPostArticle} />
      </div>

      <div className="mt-4 flex gap-x-4">
        <span className="my-2 flex items-center gap-x-2 rounded-lg text-sm font-medium dark:text-gray-300">
          Selected:
        </span>
        <SelectedTags post={postArticle} setPost={setPostArticle} />
      </div>

      <button
        className="flex max-w-[4rem] items-center justify-center gap-x-2 rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500"
        onClick={handlePublish}
      >
        post
      </button>
    </div>
  );
}
