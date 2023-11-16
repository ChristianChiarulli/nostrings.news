"use client";
import { useEffect, useState } from "react";

import useLoginStore from "@/stores/loginStore";
import useStore from "@/stores/useStore";

import UserProfile from "../profile/UserProfile";

import LoginForm from "./LoginForm";
import Modal from "./Modal";

export default function Login() {
  const loginStore = useStore(useLoginStore, (state) => state);
  const [open, setOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  const handleOpenLoginModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <>
      {loginStore?.userKeyPair.publicKey ? (
        <UserProfile />
      ) : (
        <button
          onClick={handleOpenLoginModal}
          className="flex cursor-pointer items-center gap-x-1 rounded-xl px-2 py-1.5 text-sm hover:bg-zinc-100 dark:text-white hover:dark:bg-zinc-700"
        >
          login
          <span className="text-xs" aria-hidden="true">
            &rarr;
          </span>
        </button>
      )}

      <Modal open={open} setOpen={setOpen}>
        <LoginForm setOpen={setOpen} />
      </Modal>
    </>
  ) : (
    <div className="flex min-h-[2rem] min-w-[4rem] cursor-pointer items-center gap-x-1 rounded-full bg-zinc-100 py-1.5 text-sm text-white dark:bg-zinc-800 dark:text-zinc-900"></div>
  );
}
