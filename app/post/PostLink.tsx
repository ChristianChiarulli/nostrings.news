"use client";

import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { Event, getEventHash, getSignature } from "nostr-tools";
import validator from "validator";

import { createUniqueUrl, getDomain } from "@/lib/utils";
import useLoginStore from "@/stores/loginStore";
import usePostStore from "@/stores/postStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";
import useStore from "@/stores/useStore";

import PostTags from "./PostTags";
import PostTextArea from "./PostTextArea";
import SelectedTags from "./SelectedTags";
import { PostLink } from "@/types";
import { useEffect, useState } from "react";
import useEventStore from "@/stores/eventStore";

export default function PostLink() {
  const loginStore = useStore(useLoginStore, (state) => state);
  // const postStore = useStore(usePostStore, (state) => state);

  const router = useRouter();

  const { writeRelays } = useRelayStateStore();
  const { publishPool } = useRelayStore();
  const { postLink, setPostLink, clearPostLink } = usePostStore();
  const { clearAllEvents } = useEventStore();

  if (!loginStore) {
    return null;
  }

  const handleShowCommentSection = (e: any) => {
    e.preventDefault();
    setPostLink({
      ...postLink,
      showCommentSection: !postLink.showCommentSection,
    });
  };

  function isValidUrl(url: string): boolean {
    if (url === "") {
      return true;
    }

    return validator.isURL(url);
  }

  const handleUrlChange = async (e: any) => {
    setPostLink({
      ...postLink,
      url: e.target.value,
    });

    if (!isValidUrl(e.target.value)) {
      setPostLink({
        ...postLink,
        url: e.target.value,
        urlError: "invalid url",
      });
    } else {
      setPostLink({
        ...postLink,
        url: e.target.value,
        urlError: "",
      });
    }
  };

  const validateBeforePublish = () => {
    if (postLink.title === "") {
      alert("title cannot be empty");
      return false;
    }

    if (postLink.url === "") {
      alert("url cannot be empty");
      return false;
    }

    if (!isValidUrl(postLink.url || "")) {
      alert("invalid url");
      return false;
    }

    if (postLink.tags.length === 0) {
      alert("choose at least one tag");
      return false;
    }

    return true;
  };

  const handlePublish = async (e: any) => {
    e.preventDefault();
    if (!validateBeforePublish()) {
      return;
    }

    if (!loginStore?.userKeyPair) {
      alert("login first");
      return;
    }

    const publicKey = loginStore.userKeyPair.publicKey || "";
    const secretKey = loginStore.userKeyPair.secretKey || "";

    const title = postLink.title;
    const url = postLink.url;
    const comment = postLink.text;
    const tags = postLink.tags;

    const newsEventTags = [
      ["title", title],
      ["u", url],
    ];

    const website = getDomain(url || "");

    if (website) {
      newsEventTags.push(["w", website]);
    }

    tags.forEach((tag) => {
      newsEventTags.push(["t", tag]);
    });

    let newsEvent: Event = {
      id: "",
      sig: "",
      kind: 1070,
      created_at: Math.floor(Date.now() / 1000),
      tags: newsEventTags,
      content: "",
      pubkey: publicKey,
    };

    newsEvent.id = getEventHash(newsEvent);
    if (secretKey) {
      newsEvent.sig = getSignature(newsEvent, secretKey);
    } else {
      newsEvent = await window.nostr.signEvent(newsEvent);
    }

    let commentEvent: Event | null = null;

    if (comment !== "") {
      commentEvent = {
        id: "",
        sig: "",
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", newsEvent.id]],
        content: comment,
        pubkey: publicKey,
      };
      commentEvent.id = getEventHash(commentEvent);
      if (secretKey) {
        commentEvent.sig = getSignature(commentEvent, secretKey);
      } else {
        commentEvent = await window.nostr.signEvent(commentEvent);
      }
    }

    const onCommentEventSeen = (event: Event) => {
      // TODO: cache event
      console.log("comment event", event);
      clearPostLink();
      clearAllEvents();
      router.push("/new");
    };

    const onNewsEventSeen = (event: Event) => {
      // TODO: cache event
      console.log("news event", event);
      if (commentEvent) {
        publishPool(writeRelays, commentEvent, onCommentEventSeen);
      } else {
        console.log("post published");
        clearPostLink();
        clearAllEvents();
        router.push("/new");
      }
    };

    publishPool(writeRelays, newsEvent, onNewsEventSeen);
  };

  return (
    <div className="flex flex-col justify-start space-y-6">
      <div className="max-w-md">
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
            onChange={(e) => {
              setPostLink({
                ...postLink,
                title: e.target.value,
              });
            }}
            value={postLink.title}
            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
            aria-describedby="title"
          />
        </div>
        {postLink.title !== "" ? (
          <div>
            {80 - postLink.title.length >= 0 || postLink.title.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {80 - postLink.title.length} characters remaining
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                maximum title length exceeded by{" "}
                {postLink.title.length && postLink.title.length - 80}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            80 characters remaining
          </p>
        )}
      </div>
      <div className="max-w-md">
        <label
          htmlFor="title"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          url
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="title"
            id="title"
            onChange={handleUrlChange}
            value={postLink.url}
            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-purple-700 sm:text-sm sm:leading-6"
            aria-describedby="title"
          />
        </div>
        {postLink.urlError ? (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">
            {postLink.urlError}
          </p>
        ) : null}
      </div>

      <div className="max-w-md">
        <label
          htmlFor="tags"
          className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
        >
          tags
        </label>
        <PostTags post={postLink} setPost={setPostLink} />
      </div>

      <div className="mt-4 flex gap-x-4">
        <span className="my-2 flex items-center gap-x-2 rounded-lg text-sm font-medium dark:text-gray-300">
          Selected:
        </span>
        <SelectedTags post={postLink} setPost={setPostLink} />
      </div>

      {/* <div className="flex items-center justify-between"> */}
      {/*   <button */}
      {/*     type="button" */}
      {/*     className="inline-flex items-center rounded-md border border-transparent text-sm font-medium text-white shadow-sm" */}
      {/*     onClick={handleShowCommentSection} */}
      {/*   > */}
      {/*     {postLink.showCommentSection ? ( */}
      {/*       <ChevronDownIcon className="h-5 w-5" aria-hidden="true" /> */}
      {/*     ) : ( */}
      {/*       <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> */}
      {/*     )} */}
      {/*     {postLink.showCommentSection ? "hide" : "add"} comment */}
      {/*   </button> */}
      {/* </div> */}
      {/**/}
      {/* {postLink.showCommentSection && ( */}
      {/*   <div className="max-w-lg pt-4"> */}
      {/*     <PostTextArea post={postLink} setPost={setPostLink} /> */}
      {/*   </div> */}
      {/* )} */}

      <button
        className="flex max-w-[4rem] items-center justify-center gap-x-2 rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500"
        onClick={handlePublish}
      >
        post
      </button>
    </div>
  );
}
