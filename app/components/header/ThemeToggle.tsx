"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { Theme } from "../../types";

interface Props {
  theme: Theme;
}

export default function ThemeToggle({ theme }: Props) {
  const [_theme, setTheme] = useState<Theme>(theme);

  const toggleTheme = () => {
    const root = document.getElementsByTagName("html")[0];
    root.classList.toggle(Theme.dark);
    if (root.classList.contains(Theme.dark)) {
      setTheme(Theme.dark);
      document.cookie = `theme=${Theme.dark};SameSite=Lax`;
    } else {
      setTheme(Theme.light);
      document.cookie = `theme=${Theme.light};SameSite=Lax`;
    }
  };

  return (
    <>
      <button
        className="outline-none focus:ring-0"
        onClick={toggleTheme}
      >
        {_theme === Theme.light ? (
          <SunIcon className="h-6 w-6 text-orange-500" aria-hidden="true" />
        ) : (
          <MoonIcon className="h-6 w-6 text-purple-500" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
