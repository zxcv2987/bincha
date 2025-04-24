import Link from "next/link";

export default function Content({ content }: { content: string }) {
  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <Link
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 underline underline-offset-2"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <>
      {content.split("\n").map((item, index) => (
        <p className="flex w-full flex-wrap break-words" key={index}>
          {linkifyText(item)}
        </p>
      ))}
    </>
  );
}
