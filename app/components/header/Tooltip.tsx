import { ReactNode } from "react";

interface TooltipProps {
  message: string;
  children: ReactNode;
}

export default function Tooltip({ message, children }: TooltipProps) {
  return (
    <div className="group relative z-50 hidden flex-nowrap whitespace-nowrap sm:flex">
      {children}
      <span className="absolute -top-5 left-8 scale-0 rounded bg-zinc-700 p-2 text-xs text-white transition-all group-hover:scale-100">
        {message}
      </span>
    </div>
  );
}
