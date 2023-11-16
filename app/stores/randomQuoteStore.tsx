import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { getRandomNewsQuote } from "@/lib/utils";

export interface RandomQuoteState {
  randomQuote: string;
  setRandomQuote: (quote: string) => void;
  getRandomQuote: () => string;
}

const useRandomQuoteStore = create<RandomQuoteState>()(
  devtools(
    // persist(
      (set, get) => ({
        randomQuote: getRandomNewsQuote(),
        setRandomQuote: (quote: string) => set({ randomQuote: quote }),
        getRandomQuote: () => get().randomQuote,
      }),

    //   {
    //     name: "nostrings-random-quote",
    //     storage: createJSONStorage(() => sessionStorage),
    //   },
    // ),
  ),
);

export default useRandomQuoteStore;
