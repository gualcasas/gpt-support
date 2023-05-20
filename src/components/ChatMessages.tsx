"use client";

import { MessagesContext } from "@/context/messages";
import type { HTMLAttributes } from "react";
import { useMemo, useContext } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement>;

export const ChatMessages = ({ className, ...props }: Props) => {
    const { messages } = useContext(MessagesContext);
    const inverseMessages = useMemo(() => [...messages].reverse(), [messages]);

    return (
        <div
            {...props}
            className={cn(
                "scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 flex flex-col-reverse gap-3 overflow-y-auto",
                className
            )}
        ></div>
    );
};
