import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface RelayMenuState {
  relayMenuIsOpen: boolean;
  setRelayMenuIsOpen: (value: boolean) => void;
}

export const useRelayMenuStore = create<RelayMenuState>()(
  devtools((set) => ({
    relayMenuIsOpen: false,
    setRelayMenuIsOpen: (value: boolean) => set({ relayMenuIsOpen: value }),
  })),
);
