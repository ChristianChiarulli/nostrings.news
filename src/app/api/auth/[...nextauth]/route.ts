import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type TokenWithPublicKey, type UserWithKeys } from "~/types";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "nostr",
      credentials: {
        publicKey: {
          label: "Public Key",
          type: "text",
          placeholder: "npub...",
        },
        secretKey: {
          label: "Secret Key",
          type: "text",
          placeholder: "nsec...",
        },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        if (!credentials.publicKey && !credentials.secretKey) {
          return null;
        }

        if (credentials.publicKey && !credentials.secretKey) {
          const user = {
            id: credentials.publicKey,
            publicKey: credentials.publicKey,
            secretKey: "",
          };

          return user;
        }

        if (credentials.publicKey && credentials.secretKey) {
          return {
            id: credentials.publicKey,
            publicKey: credentials.publicKey,
            secretKey: credentials.secretKey,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    // signOut: "/signout",
    error: "/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/register", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If the user object exists, it means this is the initial token creation.
      if (user) {
        token.publicKey = (user as UserWithKeys).publicKey;
      }
      return token;
    },

    async session({ session, token }) {
      // Extract the publicKey from the JWT token and add it to the session object
      const user = session.user as UserWithKeys;
      user.publicKey = (token as TokenWithPublicKey).publicKey;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
