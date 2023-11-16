import { Event } from "nostr-tools";

export type KeyPair = {
  publicKey: string;
  secretKey?: string;
};

export enum Theme {
  dark = "dark",
  light = "light",
}

export type Profile = {
  relay?: string;
  publicKey?: string;
  about: string;
  lud06?: string;
  lud16?: string;
  name: string;
  nip05?: string;
  picture: string;
  website?: string;
  banner?: string;
  location?: string;
  github?: string;
  [key: string]: any;
};

export type ZapArgs = {
  profile: string;
  event: string;
  amount: number;
  relays: string[];
  comment: string;
};
