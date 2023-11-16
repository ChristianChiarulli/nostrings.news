import * as crypto from "crypto";

import { Profile } from "@/types";

import { Event } from "nostr-tools";

import { NEWS_QUOTES } from "./constants";
import Fuse from "fuse.js";

import bolt11 from "bolt11";
import numeral from "numeral";
import useAddSatStore from "@/stores/addSatStore";

const { additionalSats } = useAddSatStore.getState();

export const shortenHash = (hash: string, length = 4 as number) => {
  if (hash) {
    return (
      hash.substring(0, length) + "..." + hash.substring(hash.length - length)
    );
  }
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function parseProfileContent(
  stringifiedContent: string | undefined,
): Profile {
  if (!stringifiedContent) {
    return {
      name: "",
      about: "",
      picture: "",
      banner: "",
      lud06: "",
      lud16: "",
      nip05: "",
      website: "",
    };
  }
  const content = JSON.parse(stringifiedContent);

  const profile: Profile = {
    name: content.name,
    about: content.about,
    picture: content.picture,
    banner: content.banner,
    lud06: content.lud06,
    lud16: content.lud16,
    nip05: content.nip05,
    website: content.website,
  };

  return profile;
}

export function getRandomNewsQuote() {
  const randomIndex = Math.floor(Math.random() * NEWS_QUOTES.length);
  return NEWS_QUOTES[randomIndex];
}

function generateUniqueHash(data: string, length: number): string {
  const sha256 = crypto.createHash("sha256");
  sha256.update(data);
  return sha256.digest("hex").substring(0, length);
}

export function createUniqueUrl(data: string): string {
  const uniqueHash = generateUniqueHash(data, 12);
  return uniqueHash;
}

export function getTagValue(key: string, array: string[][]): string | null {
  const item = array.find((element) => element[0] === key);
  return item ? item[1] : null;
}

export function getTagValues(key: string, array: string[][]): string[] {
  return array
    .filter((element) => element[0] === key)
    .map((element) => element[1]);
}

export function getDomain(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (e: any) {
    console.error(e.message);
    return null;
  }
}

export const filterPosts = (filter: string | null, list: Event[]) => {
  const options = {
    keys: ["content", "tags"],
    includeScore: true,
    distance: 100000,
    includeMatches: true,
    minMatchCharLength: 1,
    threshold: 0.1,
    // ignoreLocation: true,
  };

  if (!filter) {
    return list;
  }

  try {
    const fuse = new Fuse(list, options);
    const result = fuse.search(filter);
    return result.map((r) => r.item);
  } catch (e) {
    // console.error(e);
    return [];
  }
};

export const tw = (strings: TemplateStringsArray, ...values: string[]) =>
  String.raw({ raw: strings }, ...values);

export const weblnConnect = async () => {
  try {
    if (typeof window.webln !== "undefined") {
      await window.webln.enable();
      return true;
    } else {
      alert("No WebLN provider detected");
      return false;
    }
  } catch (e) {
    console.log("Connect Error:", e);
    return false;
  }
};

export const formatSats = (sats: number) => {
  if (sats === 0) {
    return "0 sats";
  }

  if (sats < 10000) {
    return `${sats} sats`;
  }

  return numeral(sats).format("0.0a");
};

export const addUpZaps = (
  zapReciepts: Event[] | undefined,
  additionalSats: number = 0,
): number => {
  if (!zapReciepts) {
    return 0;
  }

  const zapRecieptsSum = zapReciepts
    .map(
      (zapReciept) =>
        bolt11.decode(getTagValue("bolt11", zapReciept.tags) as string)
          .satoshis,
    )
    .filter((satoshis): satoshis is number => satoshis !== null)
    .reduce((a, b) => a + b, 0);

  if (zapRecieptsSum === 0) {
    return 0;
  }

  return zapRecieptsSum + additionalSats;
};
