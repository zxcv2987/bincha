import Link from "next/link";

export default function Content({ content }: { content: string }) {
  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <span key={i} className="break-words">
            <Link
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-zinc-400 underline underline-offset-2"
            >
              {part}
            </Link>
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      {content.split("\n").map((item, index) => (
        <p
          className="flex w-full flex-wrap break-all whitespace-pre-wrap"
          key={index}
        >
          {linkifyText(item)}
        </p>
      ))}
    </>
  );
}
