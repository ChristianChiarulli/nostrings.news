"use server";

import { SimplePool, type Event, type Filter } from "nostr-tools";

const pool: SimplePool = new SimplePool();

export async function fetchPostEvents(
  until: number | undefined = undefined,
  limit = 5,
): Promise<Event[]> {
  const filter: Filter = {
    kinds: [1070],
    until,
    limit,
  };

  const relays = ["wss://relay.damus.io", "wss://nos.lol"];

  const posts: Event[] = await pool.list(relays, [filter]);

  console.log("posts", posts);

  // HACK: workaround for symbols in the data, remove in prod
  return JSON.parse(JSON.stringify(posts)) as Event[];
}
