import Link from "next/link";

export default function LinkifiedText({ content }: { content: string }) {
  if (!content.trim()) {
    return null;
  }

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
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="rounded break-all text-zinc-500 underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
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
