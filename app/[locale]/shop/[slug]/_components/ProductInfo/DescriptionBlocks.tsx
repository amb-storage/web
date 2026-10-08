import type { DescriptionBlock } from "@/lib/storefront";

interface DescriptionBlocksProps {
  blocks: DescriptionBlock[];
}

export default function DescriptionBlocks({ blocks }: DescriptionBlocksProps) {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <p key={index} className="font-bold text-gray-900">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={index} className="list-disc space-y-1 pl-5">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "divider":
            return <hr key={index} className="border-t border-dashed border-gray-300" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
