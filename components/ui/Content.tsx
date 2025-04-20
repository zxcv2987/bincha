export default function Content({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((item, index) => (
        <p className="flex flex-wrap break-words" key={index}>
          {item}
        </p>
      ))}
    </>
  );
}
