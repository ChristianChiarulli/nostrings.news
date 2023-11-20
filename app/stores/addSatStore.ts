import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface AddSatsState {
  additionalSats: Record<string, number>;
  setAdditionalSats: (eventId: string, sats: number) => void;
  clearAdditionalSats: (eventId: string) => void;
}

const useAddSatStore = create<AddSatsState>()(
  devtools((set, _) => ({
    additionalSats: {},
    setAdditionalSats: (eventId, sats) =>
      set((prev) => ({
        additionalSats: { ...prev.additionalSats, [eventId]: sats },
      })),
    clearAdditionalSats: (eventId) =>
      set((prev) => {
        const updatedSats = { ...prev.additionalSats };
        delete updatedSats[eventId];
        return { additionalSats: updatedSats };
      }),
  })),
);

export default useAddSatStore;
