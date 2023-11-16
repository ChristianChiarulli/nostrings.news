export default function Tooltip({ message, children }: any) {
  return (
    <div className="group relative md:mt-0 mt-1 flex-nowrap flex-shrink-0 items-center justify-center whitespace-nowrap sm:flex">
      {children}
      <span className="pointer-events-none absolute top-8 z-50 flex scale-0 select-none justify-center rounded-lg bg-purple-400/90 p-1.5 text-xs text-white transition-all before:absolute sm:before:right-auto before:right-10 before:bottom-full before:border-[6px] before:border-transparent before:border-b-purple-400/90 before:content-[''] group-hover:scale-100 dark:bg-purple-500/90 dark:before:border-b-purple-500/90">
        {message}
      </span>
    </div>
  );
}
