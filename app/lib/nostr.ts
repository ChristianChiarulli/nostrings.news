import useEventStore from "@/stores/eventStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useRelayStore from "@/stores/relayStore";

import {
  Filter,
  Event,
  nip57,
  EventTemplate,
  UnsignedEvent,
  getEventHash,
  getSignature,
} from "nostr-tools";
import { getTagValue, weblnConnect } from "./utils";
import { KeyPair, ZapArgs } from "@/types";

const { setProfileEvent, getProfileEvent, addZapReciept } =
  useEventStore.getState();
const { subscribe, subscribePool, pool } = useRelayStore.getState();
const { readRelays } = useRelayStateStore.getState();

export function cacheProfiles(pubkeys: string[]) {
  const userFilter: Filter = {
    kinds: [0],
    authors: pubkeys,
  };

  const onEvent = (event: Event) => {
    const cachedEvent = getProfileEvent(event.pubkey);
    if (!cachedEvent) {
      setProfileEvent(event.pubkey, event);
    }
  };

  const onEOSE = () => {};

  subscribe(readRelays, userFilter, onEvent, onEOSE);
}

export async function cacheZapReciepts(eventId: string) {
  // console.log("caching zap reciepts");
  const zapRecieptFilter: Filter = {
    kinds: [9735],
    "#e": [eventId],
  };

  // const zapRecieptEvents = await pool.batchedList("zapReceipt", readRelays, [
  //   zapRecieptFilter,
  // ]);
  //
  // zapRecieptEvents.forEach((event) => {
  //   // console.log("zap reciept event", event);
  //   addZapReciept(eventId, event);
  // });

  const onEvent = (event: Event) => {
    addZapReciept(eventId, event);
  }

  subscribePool(readRelays, zapRecieptFilter, onEvent, () => {});
}

export async function getZapEndpoint(metadata: Event): Promise<null | string> {
  try {
    let lnurl: string = "";
    const { lud16 } = JSON.parse(metadata.content);
    if (lud16) {
      const [name, domain] = lud16.split("@");
      lnurl = `https://${domain}/.well-known/lnurlp/${name}`;
    } else {
      return null;
    }

    const res = await fetch(lnurl);
    const body = await res.json();

    if (body.allowsNostr && body.nostrPubkey) {
      return body.callback;
    }
  } catch (err) {
    /*-*/
  }

  return null;
}

export const fetchInvoice = async (
  zapEndpoint: string,
  zapRequestEvent: Event<9734>,
): Promise<string> => {
  const comment: string = zapRequestEvent.content;
  const amount: string | null = getTagValue("amount", zapRequestEvent.tags);

  let url: string = `${zapEndpoint}?amount=${amount}&nostr=${encodeURIComponent(
    JSON.stringify(zapRequestEvent),
  )}`;

  // console.log("URL", url);

  if (comment) {
    url = `${url}&comment=${encodeURIComponent(comment)}`;
  }

  const res: Response = await fetch(url);
  const { pr: invoice } = await res.json();

  return invoice;
};

export const sendZap = async (
  zapArgs: ZapArgs,
  zapperKeyPair: KeyPair,
  zapeeProfileEvent: Event,
  onSuccess: (result: SendPaymentResponse, bolt11: string) => void,
  onError: () => void,
) => {
  const connected: boolean = await weblnConnect();

  if (connected) {
    const zapEndpoint: string | null = await getZapEndpoint(zapeeProfileEvent);

    if (!zapEndpoint) {
      alert("No zap endpoint found");
      return;
    }

    const args = {
      profile: zapArgs.profile,
      event: zapArgs.event,
      amount: zapArgs.amount,
      relays: zapArgs.relays,
      comment: zapArgs.comment,
    };

    const zapEventTemplate: EventTemplate<9734> = nip57.makeZapRequest(args);
    const unsignedZapEvent: UnsignedEvent<9734> = {
      ...zapEventTemplate,
      pubkey: zapperKeyPair.publicKey,
    };

    const zapId = getEventHash(unsignedZapEvent);

    let zapEvent: Event<9734> = {
      ...unsignedZapEvent,
      id: zapId,
      sig: "",
    };

    if (zapperKeyPair.secretKey) {
      zapEvent.sig = getSignature(unsignedZapEvent, zapperKeyPair.secretKey);
    } else {
      zapEvent = await window.nostr.signEvent({
        ...unsignedZapEvent,
        id: zapId,
      });
    }

    // console.log("zap endpoint", zapEndpoint);
    // console.log("zap event", zapEvent);

    const invoice: string = await fetchInvoice(zapEndpoint, zapEvent);
    // console.log("invoice", invoice);

    try {
      const result: SendPaymentResponse = await webln.sendPayment(invoice);
      onSuccess(result, invoice);
    } catch (e) {
      // console.log("Zap Error:", e);
      console.log("Zap Error");
      onError();
    }
  }
};

export const getZapRecieptFromRelay = async (
  postEvent: Event,
  bolt11: string,
  onSuccess: (event: Event) => void,
) => {
  const postedBountyFilter: Filter = {
    kinds: [9735],
    limit: 100,
    "#e": [postEvent.id],
  };

  const onEvent = (event: Event) => {
    if (getTagValue("bolt11", event.tags) === bolt11) {
      onSuccess(event);
      console.log("zap reciept event", event);
      const zapEvent = JSON.parse(getTagValue("description", event.tags) || "");
      const zapAmount = getTagValue("amount", zapEvent.tags);
      console.log("zapped for amount:", Number(zapAmount) / 1000);
    }
  };

  const onEOSE = () => {};

  subscribePool(readRelays, postedBountyFilter, onEvent, onEOSE);
};
