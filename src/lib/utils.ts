import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromNow(createdAt: number | undefined) {
  if (!createdAt) {
    return undefined;
  }
  dayjs.extend(relativeTime);
  const time = dayjs(createdAt * 1000).fromNow();
  return time;
}

export function getDomain(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (e) {
    return null;
  }
}
