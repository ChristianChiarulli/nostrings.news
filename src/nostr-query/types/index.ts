import { type Filter, type Event, type SimplePool } from "nostr-tools";

export interface SubscribeParams {
  pool?: SimplePool;
  relays: string[];
  filter: Filter;
  timeout?: number;
  onEvent?: (event: Event) => void;
  onEOSE?: () => void;
  onEventPredicate?: (event: Event) => boolean;
}

export interface UseSubEventsParams {
  pool?: SimplePool;
  relays: string[];
  filter: Filter;
  initialEvents?: Event[];
  setEvents?: (events: Event[]) => void;
  onEvent?: (event: Event) => void;
  onEOSE?: () => void;
  onEventPredicate?: (event: Event) => boolean;
  onEventsResolved?: (events: Event[]) => void;
}
