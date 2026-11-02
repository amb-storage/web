// Dữ liệu có cấu trúc schema.org cho Google và bot AI; escape "<" theo hướng dẫn JSON-LD của Next
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}
