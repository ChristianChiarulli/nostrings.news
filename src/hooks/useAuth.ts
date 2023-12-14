import { useEffect, useState } from "react";

import { type UserWithKeys } from "~/types";
import { useSession } from "next-auth/react";

const useAuth= () => {
  const [pubkey, setPubkey] = useState<string | undefined>(undefined);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const user = session?.user as UserWithKeys;
      setPubkey(user.publicKey);
    }
  }, [session]);

  return { pubkey };
};

export default useAuth;
