import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface PostState {
  // Post Link
  postLinkTitle: string;
  setPostLinkTitle: (title: string) => void;

  postLinkUrl: string;
  setPostLinkUrl: (url: string) => void;

  errorUrl: string;
  setErrorUrl: (error: string) => void;

  postLinkTags: string[];
  setPostLinkTags: (tags: string[]) => void;

  postLinkText: string;
  setPostLinkText: (text: string) => void;

  postLinkShowCommentSection: boolean;
  setPostLinkShowCommentSection: (show: boolean) => void;

  clearPostLink: () => void;

  // Post Discussion
  postDiscussionTitle: string;
  setPostDiscussionTitle: (title: string) => void;

  postDiscussionText: string;
  setDiscussionLinkText: (text: string) => void;
}

const useRandomQuoteStore = create<PostState>()(
  devtools(
    // persist(
      (set, _) => ({
        postLinkTitle: "",
        setPostLinkTitle: (title: string) => set({ postLinkTitle: title }),

        postLinkUrl: "",
        setPostLinkUrl: (url: string) => set({ postLinkUrl: url }),

        errorUrl: "",
        setErrorUrl: (error: string) => set({ errorUrl: error }),

        postLinkTags: [],
        setPostLinkTags: (tags: string[]) => set({ postLinkTags: tags }),

        postLinkText: "",
        setPostLinkText: (text: string) => set({ postLinkText: text }),

        postLinkShowCommentSection: false,
        setPostLinkShowCommentSection: (show: boolean) =>
          set({ postLinkShowCommentSection: show }),

        clearPostLink: () =>
          set({
            postLinkTitle: "",
            postLinkUrl: "",
            errorUrl: "",
            postLinkTags: [],
            postLinkText: "",
            postLinkShowCommentSection: false,
          }),

        postDiscussionTitle: "",
        setPostDiscussionTitle: (title: string) =>
          set({ postDiscussionTitle: title }),

        postDiscussionText: "",
        setDiscussionLinkText: (text: string) =>
          set({ postDiscussionText: text }),
      }),

    //   {
    //     name: "nostrings-post-store",
    //     storage: createJSONStorage(() => sessionStorage),
    //   },
    // ),
  ),
);

export default useRandomQuoteStore;
