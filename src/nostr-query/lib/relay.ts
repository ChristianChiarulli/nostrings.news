import { type Event } from "nostr-tools";

import { type SubscribeParams } from "../types";
import defaultPool from "./pool";

export const list = ({
  pool = defaultPool,
  relays,
  filter,
  timeout = 3000,
  onEvent = (event: Event) => {
    console.debug("onEvent called", event);
  },
  onEOSE = () => {
    console.debug("onEOSE called");
  },
  onEventPredicate = () => true,
}: SubscribeParams) => {
  return new Promise((resolve) => {
    const sub = pool.sub(relays, [filter]);
    const events: Event[] = [];

    const _timeout = setTimeout(() => {
      sub.unsub();
      resolve(events);
    }, timeout);

    sub.on("eose", () => {
      sub.unsub();
      onEOSE();
      resolve(events);
    });

    sub.on("event", (event) => {
      if (onEventPredicate(event)) {
        events.push(event);
        clearTimeout(_timeout);
        onEvent(event);
      }
    });
  });
};
