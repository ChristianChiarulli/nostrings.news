import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { generatePrivateKey, getPublicKey, nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

import useLoginStore from "@/stores/loginStore";
import useStore from "@/stores/useStore";

import Tooltip from "./Tooltip";

interface LoginFormProps {
  setOpen: (open: boolean) => void;
}

export default function LoginForm({ setOpen }: LoginFormProps) {
  const loginStore = useStore(useLoginStore, (state) => state);

  const [errorNsec, setErrorNsec] = useState("");
  const [validNsec, setValidNsec] = useState("");

  const [createAccount, setCreateAccount] = useState(false);
  const [nsec, setNsec] = useState("");
  const [generatedKeyPair, setGeneratedKeyPair] = useState({
    publicKey: "",
    secretKey: "",
  });

  function validateNsec(nsec: string) {
    if (nsec === "") {
      setErrorNsec("");
      setValidNsec("");
      return;
    }

    try {
      const decodedNsec = nip19.decode(nsec).type;

      if (decodedNsec !== "nsec") {
        setErrorNsec("Invalid secret key");
        setValidNsec("");
      }

      setErrorNsec("");

      if (decodedNsec === "nsec") {
        setValidNsec("Valid secret key");
      }
    } catch (e) {
      setErrorNsec("Invalid secret key");
      setValidNsec("");
    }
  }

  const handleSecretKeyChange = (e: any) => {
    validateNsec(e.target.value);
    const privateKey = e.target.value;
    setNsec(privateKey);
  };

  useEffect(() => {
    return () => {
      setNsec("");
      setErrorNsec("");
      setValidNsec("");
      setCreateAccount(false);
      setGeneratedKeyPair({
        publicKey: "",
        secretKey: "",
      });
    };
  }, []);

  useEffect(() => {
    if (createAccount) {
      const privateKey = generatePrivateKey();
      const publicKey = getPublicKey(privateKey);
      const keyPair = {
        publicKey: nip19.npubEncode(publicKey),
        secretKey: nip19.nsecEncode(privateKey),
      };
      setGeneratedKeyPair(keyPair);
    }
  }, [createAccount]);

  const downloadKeysAndLogin = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `Public Key: ${generatedKeyPair.publicKey}\nSecret Key: ${generatedKeyPair.secretKey}`,
      ],
      { type: "text/plain" },
    );
    element.href = URL.createObjectURL(file);
    element.download = "MyNostrKeys.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

    const decodedKeyPair = {
      publicKey: nip19.decode(generatedKeyPair.publicKey).data.toString(),
      secretKey: nip19.decode(generatedKeyPair.secretKey).data.toString(),
    };

    loginStore?.setUserKeyPair(decodedKeyPair);
    setOpen(false);
  };

  const signInWithPrivateKey = () => {
    try {
      nip19.decode(nsec);
      const secretKey = nip19.decode(nsec).data.toString();

      if (secretKey === "") {
        setErrorNsec("Invalid secret key");
        return;
      }

      if (!validNsec) {
        setErrorNsec("Invalid secret key");
        return;
      }

      const keyPair = {
        publicKey: getPublicKey(secretKey),
        secretKey: secretKey,
      };
      loginStore?.setUserKeyPair(keyPair);
      setOpen(false);
    } catch (e) {
      setErrorNsec("Invalid secret key");
    }
  };

  const signInWithExtension = async (e: any) => {
    e.preventDefault();
    if (typeof nostr !== "undefined") {
      const publicKey: string = await nostr.getPublicKey();
      const keyPair = {
        publicKey: publicKey,
        secretKey: "",
      };
      loginStore?.setUserKeyPair(keyPair);
      setOpen(false);
    } else {
      alert("No extension found");
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        {createAccount && (
          <div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-zinc-900 dark:text-zinc-100">
              Create an account
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <span
                onClick={() => setCreateAccount(false)}
                className="cursor-pointer font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-500 dark:hover:text-purple-400"
              >
                Sign in
              </span>
            </p>

            <div className="mt-10">
              <div>
                <form
                  action="#"
                  method="POST"
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    downloadKeysAndLogin();
                  }}
                >
                  <div>
                    <div className="">
                      <label
                        htmlFor="nsec"
                        className="flex items-center text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                      >
                        Public Key
                        <Tooltip message={"Share this key with other users"}>
                          <InformationCircleIcon
                            className="ml-1.5 h-5 w-5 cursor-pointer text-zinc-400 dark:text-zinc-500"
                            aria-hidden="true"
                          />
                        </Tooltip>
                      </label>
                    </div>

                    <div className="mt-2">
                      <input
                        id="nsec"
                        name="nsec"
                        readOnly
                        disabled
                        value={generatedKeyPair.publicKey}
                        className="block w-full cursor-text rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="nsec"
                      className="flex items-center text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                    >
                      Secret Key
                      <Tooltip message={"Keep this key safe, never share it"}>
                        <InformationCircleIcon
                          className="ml-1.5 h-5 w-5 cursor-pointer text-zinc-400 dark:text-zinc-500"
                          aria-hidden="true"
                        />
                      </Tooltip>
                    </label>
                    <div className="mt-2">
                      <input
                        id="nsec"
                        name="nsec"
                        type="text"
                        readOnly
                        disabled
                        value={generatedKeyPair.secretKey}
                        className="block w-full cursor-text rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <p className="mt-2 flex gap-x-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    <span>Use a</span>
                    <span>
                      <a
                        href="https://getalby.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-500 dark:hover:text-purple-400"
                      >
                        nostr extension
                      </a>
                    </span>
                    <span>to login in the future</span>
                  </p>
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                    >
                      Download keys & Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {!createAccount && (
          <>
            <div>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-zinc-900 dark:text-zinc-100">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                New to Nostr?{" "}
                <span
                  onClick={() => setCreateAccount(true)}
                  className="cursor-pointer font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-500 dark:hover:text-purple-400"
                >
                  Create an account
                </span>
              </p>
            </div>

            <div className="mt-10">
              <div>
                <form
                  action="#"
                  method="POST"
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    signInWithPrivateKey();
                  }}
                >
                  <div>
                    <label
                      htmlFor="nsec"
                      className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                    >
                      Secret Key
                    </label>
                    <div className="mt-2">
                      <input
                        id="nsec"
                        name="nsec"
                        type="text"
                        placeholder="nsec..."
                        required
                        onChange={handleSecretKeyChange}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errorNsec && (
                      <p className="pt-1 text-red-500">{errorNsec}</p>
                    )}
                    {validNsec && (
                      <p className="pt-1 text-green-500">{validNsec}</p>
                    )}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-10">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <a
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#672581] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                  >
                    <svg
                      className="h-5 w-5"
                      id="_8"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                    >
                      <path
                        className="h-5 w-5 fill-[#672581] dark:fill-[#672581]"
                        d="m231.16,159.49c0,20.71,0,31.07-3.53,42.22-4.43,12.17-14.02,21.76-26.19,26.19-11.15,3.53-21.5,3.53-42.22,3.53h-62.46c-20.71,0-31.06,0-42.21-3.53-12.17-4.43-21.76-14.02-26.19-26.19-3.53-11.15-3.53-21.5-3.53-42.22v-62.46c0-20.71,0-31.07,3.53-42.22,4.43-12.17,14.02-21.76,26.19-26.19,11.15-3.52,21.5-3.52,42.21-3.52h62.46c20.71,0,31.07,0,42.22,3.52,12.17,4.43,21.76,14.02,26.19,26.19,3.53,11.15,3.53,21.5,3.53,42.22v62.46Z"
                      ></path>
                      <path
                        className="h-5 w-5 fill-white dark:fill-white"
                        d="m210.81,116.2v83.23c0,3.13-2.54,5.67-5.67,5.67h-68.04c-3.13,0-5.67-2.54-5.67-5.67v-15.5c.31-19,2.32-37.2,6.54-45.48,2.53-4.98,6.7-7.69,11.49-9.14,9.05-2.72,24.93-.86,31.67-1.18,0,0,20.36.81,20.36-10.72,0-9.28-9.1-8.55-9.1-8.55-10.03.26-17.67-.42-22.62-2.37-8.29-3.26-8.57-9.24-8.6-11.24-.41-23.1-34.47-25.87-64.48-20.14-32.81,6.24.36,53.27.36,116.05v8.38c-.06,3.08-2.55,5.57-5.65,5.57h-33.69c-3.13,0-5.67-2.54-5.67-5.67V55.49c0-3.13,2.54-5.67,5.67-5.67h31.67c3.13,0,5.67,2.54,5.67,5.67,0,4.65,5.23,7.24,9.01,4.53,11.39-8.16,26.01-12.51,42.37-12.51,36.65,0,64.36,21.36,64.36,68.69Zm-60.84-16.89c0-6.7-5.43-12.13-12.13-12.13s-12.13,5.43-12.13,12.13,5.43,12.13,12.13,12.13,12.13-5.43,12.13-12.13Z"
                      ></path>
                      <rect
                        className="h-5 w-5 fill-[#672581] dark:fill-[#672581]"
                        width="256"
                        height="256"
                      ></rect>
                    </svg>
                    <button
                      onClick={signInWithExtension}
                      className="text-sm font-semibold leading-6"
                    >
                      Nostr Extension
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
