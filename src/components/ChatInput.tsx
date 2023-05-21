"use client";

import { useState, useContext, useRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type { Message } from "@/lib/validators/message";
import { MessagesContext } from "@/context/messages";

type Props = HTMLAttributes<HTMLDivElement>;

export const ChatInput = ({ className, ...props }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [input, setInput] = useState<string>("");
    const { messages, addMessage, removeMessage, updateMessage } =
        useContext(MessagesContext);

    const { mutate: sendMessage, isLoading } = useMutation({
        mutationFn: async (userMessage: Message) => {
            const response = await fetch("/api/message", {
                method: "POST",
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            addMessage(userMessage);
            return response;
        },
        onSuccess: async (response) => {
            if (!response.body) throw new Error("No stream present");

            setInput("");

            const gptMessage: Message = {
                id: nanoid(),
                text: "",
                isUserMessage: false,
            };

            addMessage(gptMessage);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                const chunkValue = decoder.decode(value);
                updateMessage(
                    gptMessage.id,
                    (prevText) => prevText + chunkValue
                );
                if (done) break;
            }

            setTimeout(() => {
                textareaRef.current?.focus();
            }, 50);
        },
        onError: (error, userMessage) => {
            console.log(JSON.stringify(error));
            removeMessage(userMessage.id);
        },
    });

    return (
        <div {...props} className={cn("border-t border-zinc-300", className)}>
            <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
                <TextareaAutosize
                    ref={textareaRef}
                    disabled={isLoading}
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
                    className="peer block w-full resize-none border-0 bg-zinc-100 py-1.5 pr-14 text-sm text-gray-900 focus:ring-0 disabled:opacity-50 sm:leading-6"
                />
            </div>
        </div>
    );
};
