import type { ReactNode } from "react";
import type { ApiRichTextDocument, ApiRichTextMark, ApiRichTextNode } from "@/lib/api/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface RichTextProps {
    document: ApiRichTextDocument;
    className?: string;
}

// Màu chữ giới hạn theo bảng màu thương hiệu (khớp với portal)
const textColorClass = {
    GREEN: "text-(--brand-green)",
    RED: "text-[#b3261e]",
    BLUE: "text-[#1f4e8c]",
    GRAY: "text-gray-500",
} as const;

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

function applyMarks(text: ReactNode, marks: ApiRichTextMark[] = []) {
    // Màu chữ bọc trong cùng để <strong>/<a> (có màu riêng) không đè mất màu đã chọn
    const ordered = [...marks].sort((a, b) => Number(b.type === "textColor") - Number(a.type === "textColor"));
    return ordered.reduce<ReactNode>((child, mark) => {
        if (mark.type === "bold") return <strong>{child}</strong>;
        if (mark.type === "italic") return <em>{child}</em>;
        if (mark.type === "textColor") return <span className={textColorClass[mark.color]}>{child}</span>;
        // Link nội bộ đi qua Link của next-intl để giữ prefix locale
        return isExternal(mark.href) ? (
            <a href={mark.href} target="_blank" rel="noopener noreferrer">
                {child}
            </a>
        ) : (
            <Link href={mark.href}>{child}</Link>
        );
    }, text);
}

function renderNodes(nodes: ApiRichTextNode[]): ReactNode[] {
    return nodes.map((node, index) => {
        switch (node.type) {
            case "text":
                return <span key={index}>{applyMarks(node.text, node.marks)}</span>;
            case "hardBreak":
                return <br key={index} />;
            case "paragraph":
                return <p key={index}>{renderNodes(node.content)}</p>;
            case "heading": {
                // Editor có nút H2/H3 (level 2/3) → render đúng h2/h3; level 1 cũng thành h2 (h1 là tiêu đề trang)
                const Heading = node.level === 3 ? "h3" : "h2";
                return <Heading key={index}>{renderNodes(node.content)}</Heading>;
            }
            case "bulletList":
                return <ul key={index}>{renderNodes(node.content)}</ul>;
            case "orderedList":
                return <ol key={index}>{renderNodes(node.content)}</ol>;
            case "listItem":
                return <li key={index}>{renderNodes(node.content)}</li>;
            case "blockquote":
                return <blockquote key={index}>{renderNodes(node.content)}</blockquote>;
            case "doc":
                return <div key={index}>{renderNodes(node.content)}</div>;
            default:
                return null;
        }
    });
}

// Render rich text JSON (dạng ProseMirror) từ CMS thành JSX — không dùng dangerouslySetInnerHTML
export default function RichText({ document, className }: RichTextProps) {
    return <div className={cn(className)}>{renderNodes(document.content)}</div>;
}
