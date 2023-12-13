"use client";

import { Button } from "../ui/button";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  return (
    <Button onClick={() => signIn()} variant="outline" size="sm">
      login &rarr;
    </Button>
  );
}

