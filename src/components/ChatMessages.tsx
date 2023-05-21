"use client";

import { MessagesContext } from "@/context/messages";
import type { HTMLAttributes } from "react";
import { useMemo, useContext } from "react";
import { cn } from "@/lib/utils";
import { MarkdownLite } from "./MarkdownLite";

type Props = HTMLAttributes<HTMLDivElement>;

export const ChatMessages = ({ className, ...props }: Props) => {
    const { messages } = useContext(MessagesContext);
    const inverseMessages = useMemo(() => [...messages].reverse(), [messages]);

    return (
        <div
            {...props}
            className={cn(
                "scrollbar-w-2 flex flex-col-reverse gap-y-3 overflow-y-auto scrollbar scrollbar-track-blue-200 scrollbar-thumb-blue-500",
                className
            )}
        >
            {inverseMessages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                        "max-w-[80%] flex-shrink-0 overflow-x-hidden rounded-lg text-sm",
                        {
                            "ml-auto bg-blue-600 text-white":
                                message.isUserMessage,
                            "mr-auto bg-gray-200 text-gray-900":
                                !message.isUserMessage,
                        }
                    )}
                >
                    <p className="p-2">
                        <MarkdownLite text={message.text} />
                    </p>
                </div>
            ))}
        </div>
    );
};
