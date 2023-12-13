import { fetchProfileEvent } from "~/nostr-query/lib/profile";
import { type UserWithKeys } from "~/types";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import LoginButton from "./LoginButton";
import UserProfile from "./UserProfile";
import { authOptions } from "~/app/api/auth/[...nextauth]/auth";

export default async function Header() {
  const session = await getServerSession(authOptions);
  let loggedIn = false;
  let publicKey = "";
  let profileEvent;

  if (session?.user) {
    const user = session?.user as UserWithKeys;
    publicKey = user.publicKey;
    if (publicKey) {
      loggedIn = true;
      const relays = ["wss://nos.lol", "wss://relay.damus.io"];
      profileEvent = await fetchProfileEvent({ pubkey: publicKey, relays });
    }
  }

  return (
    <header className="mb-2 flex items-center justify-between border-b border-zinc-200 p-1.5 dark:border-zinc-700">
      <nav className="flex items-center px-2.5">
        <Link href="/" className="flex items-center py-1">
          <svg
            className="-ml-3.5 h-7 w-7"
            id="_8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          >
            <path
              className="h-5 w-5 fill-white dark:fill-zinc-900"
              d="m231.16,159.49c0,20.71,0,31.07-3.53,42.22-4.43,12.17-14.02,21.76-26.19,26.19-11.15,3.53-21.5,3.53-42.22,3.53h-62.46c-20.71,0-31.06,0-42.21-3.53-12.17-4.43-21.76-14.02-26.19-26.19-3.53-11.15-3.53-21.5-3.53-42.22v-62.46c0-20.71,0-31.07,3.53-42.22,4.43-12.17,14.02-21.76,26.19-26.19,11.15-3.52,21.5-3.52,42.21-3.52h62.46c20.71,0,31.07,0,42.22,3.52,12.17,4.43,21.76,14.02,26.19,26.19,3.53,11.15,3.53,21.5,3.53,42.22v62.46Z"
            ></path>
            <path
              className="h-5 w-5 fill-purple-500 dark:fill-purple-500"
              d="m210.81,116.2v83.23c0,3.13-2.54,5.67-5.67,5.67h-68.04c-3.13,0-5.67-2.54-5.67-5.67v-15.5c.31-19,2.32-37.2,6.54-45.48,2.53-4.98,6.7-7.69,11.49-9.14,9.05-2.72,24.93-.86,31.67-1.18,0,0,20.36.81,20.36-10.72,0-9.28-9.1-8.55-9.1-8.55-10.03.26-17.67-.42-22.62-2.37-8.29-3.26-8.57-9.24-8.6-11.24-.41-23.1-34.47-25.87-64.48-20.14-32.81,6.24.36,53.27.36,116.05v8.38c-.06,3.08-2.55,5.57-5.65,5.57h-33.69c-3.13,0-5.67-2.54-5.67-5.67V55.49c0-3.13,2.54-5.67,5.67-5.67h31.67c3.13,0,5.67,2.54,5.67,5.67,0,4.65,5.23,7.24,9.01,4.53,11.39-8.16,26.01-12.51,42.37-12.51,36.65,0,64.36,21.36,64.36,68.69Zm-60.84-16.89c0-6.7-5.43-12.13-12.13-12.13s-12.13,5.43-12.13,12.13,5.43,12.13,12.13,12.13,12.13-5.43,12.13-12.13Z"
            ></path>
            <rect
              className="h-5 w-5 fill-white dark:fill-zinc-900"
              width="256"
              height="256"
            ></rect>
          </svg>
          <h3 className="xs:block hidden pr-2 font-mono text-sm font-bold dark:text-zinc-200">
            no<span className="text-purple-400">_</span>strings
          </h3>
        </Link>
        {/* <Link */}
        {/*   href="/new" */}
        {/*   className="cursor-pointer rounded-xl px-2 py-1 font-mono text-sm dark:text-zinc-300" */}
        {/* > */}
        {/*   new */}
        {/* </Link> */}
        {/* <PostFilter /> */}
      </nav>
      <div className="flex items-center justify-center gap-x-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/post">post</Link>
        </Button>
        <ThemeToggle />
        {loggedIn ? (
          <UserProfile pubkey={publicKey} initialProfile={profileEvent} />
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}
