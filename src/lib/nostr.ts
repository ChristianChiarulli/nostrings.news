import { type Profile } from "~/types";
import { type Event } from "nostr-tools";

// gets the first value of a tag
export function tag(key: string, event: Event | undefined) {
  if (!event) {
    return undefined;
  }
  const array = event.tags;
  if (!array) {
    return undefined;
  }
  const item = array.find((element) => element[0] === key);
  return item ? item[1] : undefined;
}

// gets profile content
export function pc(event: Event | undefined | null) {
  if (!event) {
    return {};
  }
  return JSON.parse(event.content) as Profile;
}
