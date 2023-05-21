import Link from "next/link";
import { useMemo, Fragment } from "react";

type Props = {
    text: string;
};

export const MarkdownLite = ({ text }: Props) => {
    const memoizedParts = useMemo(() => {
        const linkRegex = /\[(.+?)\]\((.+?)\)/g;
        const parts = [];

        let lastIndex = 0;
        let match: RegExpExecArray | null = null;

        while ((match = linkRegex.exec(text))) {
            const [fullMatch, linkText, linkUrl] = match;
            const matchStart = match.index;
            const matchEnd = matchStart + fullMatch.length;

            if (lastIndex < matchStart) {
                parts.push(text.slice(lastIndex, matchStart));
            }

            if (linkUrl) {
                parts.push(
                    <Link
                        key={linkUrl}
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words text-blue-500 underline underline-offset-2"
                    >
                        {linkText}
                    </Link>
                );
            }

            lastIndex = matchEnd;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts;
    }, [text]);

    return (
        <>
            {memoizedParts.map((part, idx) => (
                <Fragment key={idx}>{part}</Fragment>
            ))}
        </>
    );
};
