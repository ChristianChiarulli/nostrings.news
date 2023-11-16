import { Event } from "nostr-tools";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { KeyPair } from "@/types";
export interface LoginState {
  userKeyPair: KeyPair;
  setUserKeyPair: (keyPair: KeyPair) => void;

  userEvent: Event | null;
  setUserEvent: (userEvent: Event | null) => void;
}

const useLoginStore = create<LoginState>()(
  devtools(
    persist(
      (set, _) => ({
        userKeyPair: {
          publicKey: "",
          privateKey: "",
        },
        setUserKeyPair: (keyPair) => set({ userKeyPair: keyPair }),

        userEvent: null,
        setUserEvent: (newEvent) =>
          set((prev) => {
            if (!newEvent) {
              return { userEvent: null };
            }

            if (
              !prev.userEvent ||
              newEvent.created_at > prev.userEvent.created_at
            ) {
              return { userEvent: newEvent };
            }
            return {};
          }),
      }),

      {
        name: "nostrings-login-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export default useLoginStore;
