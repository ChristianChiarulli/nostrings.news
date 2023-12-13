"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SigninPage() {

  const signInWithExtension = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (typeof nostr !== "undefined") {
      const publicKey: string = await nostr.getPublicKey();
      await signIn("credentials", {
        publicKey: publicKey,
        secretKey: "",
        redirect: true,
        callbackUrl: "/",
      });
    } else {
      alert("No extension found");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-md">
          <svg
            className="h-12 w-12"
            id="_8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          >
            <path
              className="h-5 w-5 fill-white dark:fill-zinc-950"
              d="m231.16,159.49c0,20.71,0,31.07-3.53,42.22-4.43,12.17-14.02,21.76-26.19,26.19-11.15,3.53-21.5,3.53-42.22,3.53h-62.46c-20.71,0-31.06,0-42.21-3.53-12.17-4.43-21.76-14.02-26.19-26.19-3.53-11.15-3.53-21.5-3.53-42.22v-62.46c0-20.71,0-31.07,3.53-42.22,4.43-12.17,14.02-21.76,26.19-26.19,11.15-3.52,21.5-3.52,42.21-3.52h62.46c20.71,0,31.07,0,42.22,3.52,12.17,4.43,21.76,14.02,26.19,26.19,3.53,11.15,3.53,21.5,3.53,42.22v62.46Z"
            ></path>
            <path
              className="h-5 w-5 fill-purple-500 dark:fill-purple-500"
              d="m210.81,116.2v83.23c0,3.13-2.54,5.67-5.67,5.67h-68.04c-3.13,0-5.67-2.54-5.67-5.67v-15.5c.31-19,2.32-37.2,6.54-45.48,2.53-4.98,6.7-7.69,11.49-9.14,9.05-2.72,24.93-.86,31.67-1.18,0,0,20.36.81,20.36-10.72,0-9.28-9.1-8.55-9.1-8.55-10.03.26-17.67-.42-22.62-2.37-8.29-3.26-8.57-9.24-8.6-11.24-.41-23.1-34.47-25.87-64.48-20.14-32.81,6.24.36,53.27.36,116.05v8.38c-.06,3.08-2.55,5.57-5.65,5.57h-33.69c-3.13,0-5.67-2.54-5.67-5.67V55.49c0-3.13,2.54-5.67,5.67-5.67h31.67c3.13,0,5.67,2.54,5.67,5.67,0,4.65,5.23,7.24,9.01,4.53,11.39-8.16,26.01-12.51,42.37-12.51,36.65,0,64.36,21.36,64.36,68.69Zm-60.84-16.89c0-6.7-5.43-12.13-12.13-12.13s-12.13,5.43-12.13,12.13,5.43,12.13,12.13,12.13,12.13-5.43,12.13-12.13Z"
            ></path>
            <rect
              className="h-5 w-5 fill-white dark:fill-zinc-950"
              width="256"
              height="256"
            ></rect>
          </svg>

          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow dark:bg-zinc-950 sm:rounded-lg sm:px-12">
            {/* <p className="mb-5 text-sm text-zinc-500"> */}
            {/*   New to Nostr?{" "} */}
            {/*   <a */}
            {/*     href="#" */}
            {/*     className="font-semibold leading-6 text-purple-600 hover:text-purple-500" */}
            {/*   > */}
            {/*     Create an account */}
            {/*   </a> */}
            {/* </p> */}

            {/* <form className="space-y-6" action="#" method="POST"> */}
            {/*   <div> */}
            {/*     <label */}
            {/*       htmlFor="email" */}
            {/*       className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50" */}
            {/*     > */}
            {/*       Email address */}
            {/*     </label> */}
            {/*     <div className="mt-2"> */}
            {/*       <input */}
            {/*         id="email" */}
            {/*         name="email" */}
            {/*         type="email" */}
            {/*         autoComplete="email" */}
            {/*         required */}
            {/*         className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-600 dark:placeholder:text-zinc-500 sm:text-sm sm:leading-6" */}
            {/*       /> */}
            {/*     </div> */}
            {/*   </div> */}
            {/**/}
            {/*   <div> */}
            {/*     <label */}
            {/*       htmlFor="password" */}
            {/*       className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50" */}
            {/*     > */}
            {/*       Password */}
            {/*     </label> */}
            {/*     <div className="mt-2"> */}
            {/*       <input */}
            {/*         id="password" */}
            {/*         name="password" */}
            {/*         type="password" */}
            {/*         autoComplete="current-password" */}
            {/*         required */}
            {/*         className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-600 dark:placeholder:text-zinc-500 sm:text-sm sm:leading-6" */}
            {/*       /> */}
            {/*     </div> */}
            {/*   </div> */}
            {/**/}
            {/*   <div className="pt-4"> */}
            {/*     <button */}
            {/*       type="submit" */}
            {/*       className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600" */}
            {/*     > */}
            {/*       Sign in */}
            {/*     </button> */}
            {/*   </div> */}
            {/* </form> */}

            <div>
              {/* <div className="relative mt-10"> */}
              {/*   <div */}
              {/*     className="absolute inset-0 flex items-center" */}
              {/*     aria-hidden="true" */}
              {/*   > */}
              {/*     <div className="w-full border-t border-zinc-200 dark:border-zinc-700" /> */}
              {/*   </div> */}
              {/*   <div className="relative flex justify-center text-sm font-medium leading-6"> */}
              {/*     <span className="bg-white px-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"> */}
              {/*       Or continue with */}
              {/*     </span> */}
              {/*   </div> */}
              {/* </div> */}

              <div className="mt-6">
                <button
                  onClick={signInWithExtension}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-[#672581] px-3 py-1.5 text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
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
                  Nostr Extension
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
