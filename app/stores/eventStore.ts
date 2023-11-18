import { Event } from "nostr-tools";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface EventState {
  newPosts: Event[];
  addNewPost: (event: Event) => void;
  setNewPosts: (events: Event[]) => void;
  getNewPost: () => Event | null;
  removeNewPost: (id: string) => void;
  clearNewPosts: () => void;
  newPostLimit: number;
  setNewPostLimit: (limit: number) => void;

  taggedPosts: Record<string, Event[]>;
  addTaggedPost: (tag: string, event: Event) => void;
  setTaggedPosts: (tag: string, events: Event[]) => void;
  getTaggedPosts: (tag: string) => Event[];
  removeTaggedPost: (id: string) => void;
  clearTaggedPosts: () => void;
  taggedPostLimit: number;
  setTaggedPostLimit: (limit: number) => void;

  sitePosts: Record<string, Event[]>;
  addSitePost: (site: string, event: Event) => void;
  setSitePosts: (site: string, events: Event[]) => void;
  getSitePosts: (site: string) => Event[];
  removeSitePost: (id: string) => void;
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

  userPosts: Record<string, Event[]>;
  addUserPost: (site: string, event: Event) => void;
  setUserPosts: (site: string, events: Event[]) => void;
  getUserPosts: (site: string) => Event[];
  removeUserPost: (id: string) => void;
  clearUserPosts: () => void;
  userPostLimit: number;
  setUserPostLimit: (limit: number) => void;


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
      removeNewPost: (id) =>
        set((prev) => ({
          newPosts: prev.newPosts.filter((e) => e.id !== id),
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
      removeTaggedPost: (id) =>
        set((prev) => ({
          taggedPosts: Object.fromEntries(
            Object.entries(prev.taggedPosts).map(([tag, events]) => [
              tag,
              events.filter((e) => e.id !== id),
            ]),
          ),
        })),
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
      clearSitePosts: () => set({ sitePosts: {} }),
      removeSitePost: (id) =>
        set((prev) => ({
          sitePosts: Object.fromEntries(
            Object.entries(prev.sitePosts).map(([site, events]) => [
              site,
              events.filter((e) => e.id !== id),
            ]),
          ),
        })),


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
          if (!currentEvent || userEvent.created_at > currentEvent.created_at) {
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

      userPosts: {},
      addUserPost: (site, event) =>
        set((prev) => ({
          userPosts: {
            ...prev.userPosts,
            [site]: [...(prev.userPosts[site] ?? []), event],
          },
        })),
      setUserPosts: (site, events) =>
        set((prev) => ({
          userPosts: { ...prev.userPosts, [site]: events },
        })),
      getUserPosts: (site) => get().userPosts[site] ?? [],
      clearUserPosts: () => set({ userPosts: {} }),
      removeUserPost: (id) =>
        set((prev) => ({
          userPosts: Object.fromEntries(
            Object.entries(prev.userPosts).map(([site, events]) => [
              site,
              events.filter((e) => e.id !== id),
            ]),
          ),
        })),
      userPostLimit: 5,
      setUserPostLimit: (limit) => set({ userPostLimit: limit }),


      search: "",
      setSearch: (search) => set({ search }),
      getSearch: () => get().search,

      clearAllEvents: () => {
        set({
          newPosts: [],
          taggedPosts: {},
          sitePosts: {},
          userPosts: {},
          // zapReciepts: {},
          cachedPost: null,
          // profileEvent: {},
          newPostLimit: 5,
          taggedPostLimit: 5,
          sitePostLimit: 5,
          userPostLimit: 5,
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
