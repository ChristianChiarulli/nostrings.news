"use client";

import Avatar from "@/components/profile/Avatar";
import { parseProfileContent } from "@/lib/utils";
import useLoginStore from "@/stores/loginStore";
import useRelayStateStore from "@/stores/relayStateStore";
import useStore from "@/stores/useStore";
import { Profile } from "@/types";
import { ArrowPathIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Event, getEventHash, getSignature } from "nostr-tools";
import useRelayStore from "@/stores/relayStore";
import SimpleNotification from "@/components/notifications/SimpleNotification";
import { utils } from "lnurl-pay";
import { bech32 } from "bech32";
import { useRouter } from "next/navigation";

// TODO: Link middleware to handle login
export default function Settings() {
  const router = useRouter();
  const loginStore = useStore(useLoginStore, (state) => state);
  const { writeRelays } = useRelayStateStore();
  const { publishPool } = useRelayStore();
  const [profile, setProfile] = useState<Profile>(
    parseProfileContent(
      JSON.stringify({
        name: "",
        picture: "",
        about: "",
        lud16: "",
        nip05: "",
        website: "",
      }),
    ),
  );
  const [showNotification, setShowNotification] = useState(false);

  const convertLud16ToLud06 = (lud16: string): string => {
    if (!utils.isLightningAddress(lud16)) {
      return "";
    }

    const url = utils.decodeUrlOrAddress(lud16);

    if (!utils.isUrl(url)) {
      return "";
    }

    const words = bech32.toWords(Buffer.from(url, "utf8"));
    return bech32.encode("lnurl", words, 2000);
  };

  useEffect(() => {
    if (!loginStore?.userEvent) {
      return;
    }

    if (!loginStore?.userKeyPair.publicKey) {
      // HACK: use next auth in the future
      router.push("/");
    }

    setProfile(parseProfileContent(loginStore?.userEvent?.content));
  }, [loginStore?.userEvent]);

  const updateProfile = async () => {
    if (!loginStore?.userEvent) {
      return;
    }

    if (profile.lud16) {
      profile.lud06 = convertLud16ToLud06(profile.lud16);
    }

    const updatedProfile = {
      ...parseProfileContent(loginStore.userEvent.content),
      ...profile,
    };

    let event: Event = {
      id: "",
      sig: "",
      kind: 0,
      created_at: Math.floor(Date.now() / 1000),
      tags: loginStore.userEvent.tags,
      content: JSON.stringify(updatedProfile),
      pubkey: loginStore.userKeyPair.publicKey,
    };

    event.id = getEventHash(event);

    if (loginStore.userKeyPair.secretKey) {
      event.sig = getSignature(event, loginStore.userKeyPair.secretKey);
    } else {
      event = await window.nostr.signEvent(event);
    }

    const onSeen = (event: Event) => {
      loginStore.setUserEvent(event);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    };

    publishPool(writeRelays, event, onSeen);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateProfile();
  };

  const refreshAccount = () => {
    loginStore?.clearUserEvent();
  };

  return (
    <div className="flex w-full flex-col items-center justify-center px-4 pb-24 pt-10 sm:px-0">
      <form className="w-full max-w-4xl" onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-zinc-900/10 pb-12 dark:border-zinc-700">
            <div className="flex items-center gap-x-2">
              <h2 className="text-lg font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
                account settings
              </h2>
              <button type="button" onClick={refreshAccount}>
                <ArrowPathIcon className="h-4 w-4 text-zinc-900 dark:text-zinc-400" />
              </button>
            </div>
            <div className="mt-10 flex flex-col gap-x-6 gap-y-8">
              <div className="mt-2 flex items-center gap-x-3">
                {loginStore?.userKeyPair.publicKey ? (
                  <Avatar
                    picture={profile.picture}
                    pubkey={loginStore?.userKeyPair.publicKey}
                    className="inline-block h-12 w-12"
                  />
                ) : (
                  <UserCircleIcon
                    className="h-12 w-12 text-zinc-300 dark:text-zinc-600"
                    aria-hidden="true"
                  />
                )}

                <div className="flex w-full max-w-sm rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600 dark:ring-zinc-600">
                  <input
                    name="picture"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-600 sm:text-sm sm:leading-6"
                    placeholder="image URL"
                    value={profile.picture}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        picture: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                >
                  username
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600 dark:ring-zinc-600 sm:max-w-md">
                    <input
                      name="username"
                      type="text"
                      id="username"
                      autoComplete="username"
                      className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-600 sm:text-sm sm:leading-6"
                      value={profile.name}
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          name: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                >
                  about
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600 dark:ring-zinc-600 sm:max-w-md">
                    <input
                      name="about"
                      type="text"
                      id="about"
                      className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-600 sm:text-sm sm:leading-6"
                      value={profile.about}
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          about: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="lud16"
                  className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                >
                  lightning address
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600 dark:ring-zinc-600 sm:max-w-md">
                    <input
                      name="lud16"
                      type="text"
                      id="lud16"
                      autoComplete="lud16"
                      className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-600 sm:text-sm sm:leading-6"
                      value={profile.lud16}
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          lud16: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="nip05"
                  className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                >
                  nip05
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600 dark:ring-zinc-600 sm:max-w-md">
                    <input
                      name="nip05"
                      type="text"
                      id="nip05"
                      autoComplete="nip05"
                      className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-600 sm:text-sm sm:leading-6"
                      value={profile.nip05}
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          nip05: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                >
                  website
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600 dark:ring-zinc-600 sm:max-w-md">
                    <input
                      type="text"
                      name="website"
                      id="website"
                      autoComplete="website"
                      className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-600 sm:text-sm sm:leading-6"
                      value={profile.website}
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          website: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-start">
          <button
            className="flex max-w-[4rem] items-center justify-center gap-x-2 rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500"
            type="submit"
          >
            submit
          </button>
        </div>
      </form>
      <SimpleNotification
        type="success"
        title="success"
        message={"profile updated"}
        show={showNotification}
        setShow={setShowNotification}
      />
    </div>
  );
}
