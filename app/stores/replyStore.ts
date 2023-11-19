import { Reply } from "@/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface ReplyState {
  reply: Reply;
  setReply: (reply: Reply) => void;
  clearReply: () => void;
}

const useReplyStore = create<ReplyState>()(
  devtools(
    persist(
      (set, _) => ({
        reply: {
          text: "",
          image: "",
        },
        setReply: (reply: Reply) => {
          set((state) => ({
            reply: {
              ...state.reply,
              ...reply,
            },
          }));
        },
        clearReply: () => {
          set(() => ({
            reply: {
              text: "",
              image: "",
            },
          }));
        },
      }),

      {
        name: "nostrings-reply-storage",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export default useReplyStore;
