import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface AddSatsState {
  additionalSats: Record<string, number>;
  setAdditionalSats: (eventId: string, sats: number) => void;
  clearAdditionalSats: (eventId: string) => void;
}

const useAddSatStore = create<AddSatsState>()(
  devtools(
    // persist(
      (set, _) => ({
        additionalSats: {},
        setAdditionalSats: (eventId, sats) =>
          set((prev) => ({
            additionalSats: { ...prev.additionalSats, [eventId]: sats },
          })),
        clearAdditionalSats: (eventId) =>
          set((prev) => {
            const { [eventId]: _, ...rest } = prev.additionalSats;
            return { additionalSats: rest };
          }),
      }),

      // {
      //   name: "nostrings-additional-sats",
      //   storage: createJSONStorage(() => sessionStorage),
      // },
    // ),
  ),
);

export default useAddSatStore;
