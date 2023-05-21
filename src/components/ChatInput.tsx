"use client";

import { useState, useContext, useRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type { Message } from "@/lib/validators/message";
import { MessagesContext } from "@/context/messages";
import { CornerDownLeft, Loader2 } from "lucide-react";

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
            if (!response.ok) throw new Error("Error in request");
            return response;
        },
        onMutate: (userMessage: Message) => {
            addMessage(userMessage);
            setInput("");
        },
        onSuccess: async (response) => {
            if (!response.body) throw new Error("No stream present");

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
            setInput(userMessage.text);
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
                    className="peer block w-full resize-none border-0 bg-zinc-100 py-1.5 pr-14 text-sm text-gray-900 focus:border-b-2 focus:border-b-indigo-600 focus:ring-0 disabled:opacity-50 sm:leading-6"
                />
                <div className="absolute inset-y-0 right-2 flex items-center py-1.5">
                    <kbd className="rounded border border-gray-400 bg-white px-1 text-gray-500">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CornerDownLeft className="h-4 w-4" />
                        )}
                    </kbd>
                </div>
            </div>
        </div>
    );
};
