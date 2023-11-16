import { Event, Filter, SimplePool } from "nostr-tools";
import { create } from "zustand";

export interface RelaysState {
  pool: SimplePool;
  subscribePool: (
    relayUrls: string[],
    filter: Filter,
    onEvent: (event: Event<any>) => void,
    onEOSE: () => void,
  ) => void;
  publishPool: (
    relayUrls: string[],
    event: Event<any>,
    onSeen: (event: Event<any>) => void,
  ) => void;
  subscribe: (
    relayUrls: string[],
    filter: Filter,
    onEvent: (event: Event<any>) => void,
    onEOSE: () => void,
  ) => void;
}

const useRelayStore = create<RelaysState>((_, get) => ({
  pool: new SimplePool(),
  subscribePool: (
    relayUrls: string[],
    filter: Filter,
    onEvent: (event: Event<any>) => void,
    onEOSE: () => void,
  ) => {
    const { pool } = get();
    const sub = pool.sub(relayUrls, [filter]);
    sub.on("event", onEvent);
    sub.on("eose", () => {
      console.log("info", `✅ nostr (pool): End of stream!`);
      sub.unsub();
      onEOSE();
    });
  },

  publishPool: async (
    relayUrls: string[],
    event: Event<any>,
    onSeen: (event: Event<any>) => void,
  ) => {
    const { pool } = get();
    const pubs = pool.publish(relayUrls, event);

    try {
      await Promise.all(pubs);
    } catch (e) {
      console.error("Error publishing event: ", e);
    }

    const publishedEvent = await pool.get(relayUrls, {
      ids: [event.id],
    });

    if (publishedEvent) {
      onSeen(publishedEvent);
    }
  },
  subscribe: async (
    relayUrls: string[],
    filter: Filter,
    onEvent: (event: Event<any>) => void,
    onEOSE: () => void,
  ) => {
    for (const relayUrl of relayUrls) {
      const { pool } = get();
      await pool.ensureRelay(relayUrl).then((relay) => {
        const sub = relay.sub([filter]);

        sub.on("event", (event: Event<any>) => {
          console.log("info", `✅ nostr (${relayUrl}): Event!`);
          onEvent(event);
        });

        sub.on("eose", () => {
          console.log("info", `✅ nostr (${relayUrl}): End of stream!`);
          sub.unsub();
          onEOSE();
        });
      });
    }
  },
}));

export default useRelayStore;
