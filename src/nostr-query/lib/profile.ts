import { type Event, type Filter } from "nostr-tools";

import { type BatchedProfileEventsParams, type Profile } from "../types";
import defaultPool from "./pool";

// TODO: get the latest profile event for a pubkey
export const batchedProfileEvents = ({
  pool = defaultPool,
  relays,
  pubkey,
}: BatchedProfileEventsParams) => {
  const filter: Filter = {
    kinds: [0],
    authors: [pubkey],
    limit: 1,
  };
  return pool.batchedList("profiles", relays, [filter]);
  // return pool.list(relays, [filter]);
};

export const fetchProfileEvent = ({
  pool = defaultPool,
  relays,
  pubkey,
}: BatchedProfileEventsParams) => {
  console.log("fetchProfileEvent");
  const filter: Filter = {
    kinds: [0],
    authors: [pubkey],
    limit: 1,
  };
  return pool.get(relays, filter);
};

export function pc(event: Event | undefined | null) {
  if (!event) {
    return {};
  }

  // console.log(event);

  return JSON.parse(event.content) as Profile;
}
