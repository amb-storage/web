interface LanguageFlagProps {
    code: string;
    className?: string;
}

// Cờ SVG inline (không dùng emoji vì Windows không hiển thị emoji cờ): ja → Nhật, en → Mỹ; cùng tỉ lệ 3:2 để 2 cờ cân nhau
export default function LanguageFlag({ code, className }: LanguageFlagProps) {
    if (code === "ja") {
        return (
            <svg viewBox="0 0 30 20" className={className} aria-hidden>
                <rect width="30" height="20" fill="#fff" />
                <circle cx="15" cy="10" r="6" fill="#BC002D" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 30 20" className={className} aria-hidden>
            <rect width="30" height="20" fill="#fff" />
            {Array.from({ length: 7 }, (_, i) => (
                <rect
                    key={i}
                    y={(i * 40) / 13}
                    width="30"
                    height={20 / 13}
                    fill="#B22234"
                />
            ))}
            <rect width="12" height={(20 * 7) / 13} fill="#3C3B6E" />
            {Array.from({ length: 4 }, (_, row) =>
                Array.from({ length: 5 }, (_, col) => (
                    <circle
                        key={`${row}-${col}`}
                        cx={1.4 + col * 2.3}
                        cy={1.5 + row * 2.6}
                        r="0.55"
                        fill="#fff"
                    />
                )),
            )}
        </svg>
    );
}
