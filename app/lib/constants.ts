import { Satoshis } from "lnurl-pay/dist/types/types";

export const RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  // "wss://nostr-pub.wellorder.net",
  // "wss://nostr.mutinywallet.com",
  // "wss://relay.primal.net",
  // "wss://relay.snort.social",
  // "wss://eden.nostr.land",
  // "wss://nostr.wine/",
];

export const NEWS_QUOTES = [
  "The press is a powerful weapon. I intend to wield it.",
  "Get me that story! Headlines sell papers, and I want this on the front page!",
  "Journalism is about uncovering the truth!",
  "No story is too small if it's the truth.",
  "We need facts, not fluff!",
  "This is a newspaper, not a knitting circle.",
  "Seems we've got a bit of news. Just listen to this.",
  "And here's me! With the news.",
  "We interrupt our regularly scheduled program for some news!",
  "Here's some news from the world outside.",
  "Let's hear... about the world.",
  "Stay tuned, America, for updates!",
  "And now, a super important public service announcement.",
  "Bringing you the truth, no matter how bad it hurts.",
];

export const POSSIBLE_TAGS = [
  "bitcoin",
  "nostr",
  "lightning",
  "programming",
  "hiring",
  "ai",
  "tech",
  "science",
  "politics",
  "sports",
  "entertainment",
  "business",
  "finance",
  "health",
  "weather",
  "philosophy",
  "religion",
  "art",
  "music",
  "culture",
  "history",
  "education",
  "travel",
  "food",
];

export const PRESET_AMOUNTS = [
  { value: 1000 as Satoshis, label: "1k" },
  { value: 5000 as Satoshis, label: "5k" },
  { value: 10000 as Satoshis, label: "10k" },
  { value: 25000 as Satoshis, label: "25k" },
];
