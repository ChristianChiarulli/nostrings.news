import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { RELAYS } from "@/lib/constants";

export interface RelaysState {
  allRelays: string[];
  addRelay: (relayUrl: string) => void;
  removeRelay: (relayUrl: string) => void;

  readRelays: string[];
  addReadRelay: (relayUrl: string) => void;
  removeReadRelay: (relayUrl: string) => void;

  writeRelays: string[];
  addWriteRelay: (relayUrl: string) => void;
  removeWriteRelay: (relayUrl: string) => void;
}

const useRelayStateStore = create<RelaysState>()(
  devtools(
    persist(
      (set, _) => ({
        allRelays: RELAYS,
        addRelay: (relayUrl) =>
          set((prev) => ({
            allRelays: [...prev.allRelays, relayUrl],
          })),
        removeRelay: (relayUrl) =>
          set((prev) => ({
            allRelays: prev.allRelays.filter((r) => r !== relayUrl),
          })),

        readRelays: RELAYS,
        addReadRelay: (relayUrl) =>
          set((prev) => ({
            readRelays: [...prev.readRelays, relayUrl],
          })),
        removeReadRelay: (relayUrl) =>
          set((prev) => ({
            readRelays: prev.readRelays.filter((r) => r !== relayUrl),
          })),

        writeRelays: RELAYS,
        addWriteRelay: (relayUrl) =>
          set((prev) => ({
            writeRelays: [...prev.writeRelays, relayUrl],
          })),
        removeWriteRelay: (relayUrl) =>
          set((prev) => ({
            writeRelays: prev.writeRelays.filter((r) => r !== relayUrl),
          })),
      }),

      {
        name: "nostrings-relay-state-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export default useRelayStateStore;

