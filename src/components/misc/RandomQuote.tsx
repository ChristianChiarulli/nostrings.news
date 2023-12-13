type Props = {
  quote: string;
};

export default function RandomQuote({ quote }: Props) {
  return (
    <h1 className=" mb-8 text-lg font-bold text-zinc-700 dark:text-zinc-400">
      {`"${quote}"`}
    </h1>
  );
}
