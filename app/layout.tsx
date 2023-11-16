import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Refresh from "./components/util/Refresh";
import RelayMenu from "./components/menus/RelayMenu";

export const metadata: Metadata = {
  title: "noStrings",
  description: "noStrings.news",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = cookies().get("theme");
  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable} ${theme?.value}`}
      lang="en"
    >
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <div className="flex w-full">
          <div className="fixed inset-0 flex justify-center sm:px-8">
            <div className="flex w-full max-w-6xl lg:px-8">
              <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20"></div>
            </div>
          </div>
          <div className="relative flex w-full flex-col">
            <main className="flex-auto">
              <div className="relative px-2 sm:px-8 lg:px-12">
                <div className="sm:px-8">
                  <div className="mx-auto w-full max-w-7xl lg:px-8">
                    <div className="mx-auto max-w-2xl lg:max-w-5xl">
                      <Header />
                      {children}
                      <RelayMenu />
                      <Footer />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
