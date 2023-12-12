import { type Event } from "nostr-tools";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface EventState {
  newPostEvents: Event[];
  addNewPostEvent: (event: Event) => void;
  setNewPostEvents: (events: Event[]) => void;
  removeNewPostEvent: (id: string) => void;

  replyEvents: Record<string, Event[]>;
  addReplyEvent: (id: string, event: Event) => void;
  setReplyEvents: (id: string, events: Event[]) => void;
  removeReplyEvent: (id: string) => void;

  profileMap: Record<string, Event | null>;
  addProfile: (pubkey: string, userEvent: Event) => void;

  zapReciepts: Record<string, Event[]>;
  addZapReciept: (eventId: string, event: Event) => void;
}

const useEventStore = create<EventState>()(
  devtools((set) => ({
    newPostEvents: [],
    addNewPostEvent: (event) =>
      set((prev) => ({
        newPostEvents: [...prev.newPostEvents, event],
      })),
    setNewPostEvents: (events) => set({ newPostEvents: events }),
    removeNewPostEvent: (id) =>
      set((prev) => ({
        newPostEvents: prev.newPostEvents.filter((e) => e.id !== id),
      })),

    profileMap: {},
    addProfile: (pubkey, userEvent) =>
      set((prev) => {
        const currentEvent = prev.profileMap[pubkey];
        if (!currentEvent || userEvent.created_at > currentEvent.created_at) {
          return {
            profileMap: {
              ...prev.profileMap,
              [pubkey]: userEvent,
            },
          };
        }
        return {};
      }),

    replyEvents: {},
    addReplyEvent: (id, event) =>
      set((prev) => ({
        replyEvents: {
          ...prev.replyEvents,
          [id]: [...(prev.replyEvents[id] ?? []), event],
        },
      })),
    setReplyEvents: (id, events) =>
      set((prev) => ({
        replyEvents: { ...prev.replyEvents, [id]: events },
      })),
    removeReplyEvent: (id) =>
      set((prev) => ({
        replyEvents: Object.fromEntries(
          Object.entries(prev.replyEvents).map(([reply, events]) => [
            reply,
            events.filter((e) => e.id !== id),
          ]),
        ),
      })),

    zapReciepts: {},
    addZapReciept: (eventId, event) =>
      set((prev) => ({
        zapReciepts: {
          ...prev.zapReciepts,
          [eventId]: [...(prev.zapReciepts[eventId] ?? []), event],
        },
      })),
  })),
);

export default useEventStore;
