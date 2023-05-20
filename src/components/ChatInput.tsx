"use client";

import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validators/message";

type Props = HTMLAttributes<HTMLDivElement> & {};

export const ChatInput = ({ className, ...props }: Props) => {
    const [input, setInput] = useState<string>("");

    const { mutate: sendMessage, isLoading } = useMutation({
        mutationFn: async (message: Message) => {
            const response = await fetch("/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: "hello" }),
            });

            return response.body;
        },
        onSuccess: () => {
            console.log("success");
        },
    });

    return (
        <div {...props} className={cn("border-t border-zinc-300", className)}>
            <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
                <TextareaAutosize
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const message: Message = {
                                id: nanoid(),
                                isUserMessage: true,
                                text: input,
                            };
                            sendMessage(message);
                        }
                    }}
                    rows={2}
                    maxRows={4}
                    autoFocus
                    placeholder="Write a message..."
                    className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6"
                />
            </div>
        </div>
    );
};