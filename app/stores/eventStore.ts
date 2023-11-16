import { Event } from "nostr-tools";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface EventState {
  newPosts: Event[];
  addNewPost: (event: Event) => void;
  setNewPosts: (events: Event[]) => void;
  getNewPost: () => Event | null;
  removeNewPost: (event: Event) => void;
  clearNewPosts: () => void;

  newPostLimit: number;
  setNewPostLimit: (limit: number) => void;

  taggedPosts: Record<string, Event[]>;
  addTaggedPost: (tag: string, event: Event) => void;
  setTaggedPosts: (tag: string, events: Event[]) => void;
  getTaggedPosts: (tag: string) => Event[];
  removeTaggedPost: (tag: string) => void;
  clearTaggedPosts: () => void;

  taggedPostLimit: number;
  setTaggedPostLimit: (limit: number) => void;

  sitePosts: Record<string, Event[]>;
  addSitePost: (site: string, event: Event) => void;
  setSitePosts: (site: string, events: Event[]) => void;
  getSitePosts: (site: string) => Event[];
  removeSitePost: (site: string) => void;
  clearSitePosts: () => void;

  sitePostLimit: number;
  setSitePostLimit: (limit: number) => void;

  zapReciepts: Record<string, Event[]>;
  addZapReciept: (eventId: string, event: Event) => void;
  getZapReciepts: (eventId: string) => Event[];
  clearZapReciepts: () => void;

  cachedPost: Event | null;
  setCachedPost: (event: Event | null) => void;

  profileEvent: Record<string, Event | null>;
  setProfileEvent: (pubkey: string, userEvent: Event) => void;
  getProfileEvent: (pubkey: string) => Event | null;

  clearAllEvents: () => void;

  search: string;
  setSearch: (search: string) => void;
  getSearch: () => string;
}

const useEventStore = create<EventState>()(
  devtools(
    // persist(
      (set, get) => ({
        newPosts: [],
        addNewPost: (event) =>
          set((prev) => ({
            newPosts: [...prev.newPosts, event],
          })),
        setNewPosts: (events) => set({ newPosts: events }),
        getNewPost: () => get().newPosts[0] ?? null,
        removeNewPost: (event) =>
          set((prev) => ({
            newPosts: prev.newPosts.filter((e) => e.id !== event.id),
          })),
        clearNewPosts: () => set({ newPosts: [] }),

        newPostLimit: 5,
        setNewPostLimit: (limit) => set({ newPostLimit: limit }),

        taggedPosts: {},
        addTaggedPost: (tag, event) =>
          set((prev) => ({
            taggedPosts: {
              ...prev.taggedPosts,
              [tag]: [...(prev.taggedPosts[tag] ?? []), event],
            },
          })),
        setTaggedPosts: (tag, events) =>
          set((prev) => ({
            taggedPosts: { ...prev.taggedPosts, [tag]: events },
          })),
        getTaggedPosts: (tag) => get().taggedPosts[tag] ?? [],
        removeTaggedPost: (tag) =>
          set((prev) => {
            const updatedTaggedPosts = { ...prev.taggedPosts };
            delete updatedTaggedPosts[tag];
            return { taggedPosts: updatedTaggedPosts };
          }),
        clearTaggedPosts: () => set({ taggedPosts: {} }),

        taggedPostLimit: 5,
        setTaggedPostLimit: (limit) => set({ taggedPostLimit: limit }),

        sitePosts: {},
        addSitePost: (site, event) =>
          set((prev) => ({
            sitePosts: {
              ...prev.sitePosts,
              [site]: [...(prev.sitePosts[site] ?? []), event],
            },
          })),
        setSitePosts: (site, events) =>
          set((prev) => ({
            sitePosts: { ...prev.sitePosts, [site]: events },
          })),
        getSitePosts: (site) => get().sitePosts[site] ?? [],
        removeSitePost: (site) =>
          set((prev) => {
            const updatedSitePosts = { ...prev.sitePosts };
            delete updatedSitePosts[site];
            return { sitePosts: updatedSitePosts };
          }),
        clearSitePosts: () => set({ sitePosts: {} }),

        sitePostLimit: 5,
        setSitePostLimit: (limit) => set({ sitePostLimit: limit }),

        zapReciepts: {},
        addZapReciept: (eventId, event) =>
          set((prev) => ({
            zapReciepts: {
              ...prev.zapReciepts,
              [eventId]: [...(prev.zapReciepts[eventId] ?? []), event],
            },
          })),
        getZapReciepts: (eventId) => get().zapReciepts[eventId] ?? [],
        clearZapReciepts: () => set({ zapReciepts: {} }),


        cachedPost: null,
        setCachedPost: (event) => set({ cachedPost: event }),

        profileEvent: {},
        setProfileEvent: (pubkey, userEvent) =>
          set((prev) => {
            const currentEvent = prev.profileEvent[pubkey];
            if (
              !currentEvent ||
              userEvent.created_at > currentEvent.created_at
            ) {
              return {
                profileEvent: {
                  ...prev.profileEvent,
                  [pubkey]: userEvent,
                },
              };
            }
            return {};
          }),
        getProfileEvent: (pubkey) => get().profileEvent[pubkey] ?? null,

        search: "",
        setSearch: (search) => set({ search }),
        getSearch: () => get().search,

        clearAllEvents: () => {
          set({
            newPosts: [],
            taggedPosts: {},
            sitePosts: {},
            zapReciepts: {},
            cachedPost: null,
            profileEvent: {},
          });
        },
      }),

    //   {
    //     name: "nostrings-event-storage",
    //     storage: createJSONStorage(() => sessionStorage),
    //   },
    // ),
  ),
);

export default useEventStore;
