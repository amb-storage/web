import type { ReactNode } from "react";
import type { ApiRichTextDocument, ApiRichTextMark, ApiRichTextNode } from "@/lib/api/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface RichTextProps {
    document: ApiRichTextDocument;
    className?: string;
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

function applyMarks(text: ReactNode, marks: ApiRichTextMark[] = []) {
    return marks.reduce<ReactNode>((child, mark) => {
        if (mark.type === "bold") return <strong>{child}</strong>;
        if (mark.type === "italic") return <em>{child}</em>;
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
                const Heading = node.level === 1 ? "h2" : node.level === 2 ? "h3" : "h4";
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
