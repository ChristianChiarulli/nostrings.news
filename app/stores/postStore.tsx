import { PostArticle, PostLink } from "@/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface PostState {
  // Post Link
  postLink: PostLink;
  setPostLink: (postLink: PostLink) => void;
  clearPostLink: () => void;

  postArticle: PostArticle;
  setPostArticle: (postArticle: PostArticle) => void;
  clearPostArticle: () => void;
}

const usePostStore = create<PostState>()(
  devtools(
    persist(
      (set, _) => ({
        postLink: {
          title: "",
          url: "",
          urlError: "",
          tags: [],
          text: "",
          showCommentSection: false,
        },
        setPostLink: (postLink: PostLink) => {
          set((state) => ({
            postLink: {
              ...state.postLink,
              ...postLink,
            },
          }));
        },
        clearPostLink: () => {
          set(() => ({
            postLink: {
              title: "",
              url: "",
              urlError: "",
              tags: [],
              text: "",
              showCommentSection: false,
            },
          }));
        },
        postArticle: {
          title: "",
          image: "",
          summary: "",
          text: "",
          tags: [],
        },
        setPostArticle: (postArticle: PostArticle) => {
          set((state) => ({
            postArticle: {
              ...state.postArticle,
              ...postArticle,
            },
          }));
        },
        clearPostArticle: () => {
          set(() => ({
            postArticle: {
              title: "",
              image: "",
              summary: "",
              text: "",
              tags: [],
            },
          }));
        },
      }),

      {
        name: "nostrings-event-storage",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export default usePostStore;
