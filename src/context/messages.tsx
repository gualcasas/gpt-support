"use client";

import type { Message } from "@/lib/validators/message";
import { nanoid } from "nanoid";
import { createContext, useCallback, useState } from "react";

type TMessagesContext = {
    messages: Message[];
    addMessage: (message: Message) => void;
    removeMessage: (id: string) => void;
    updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
};

export const MessagesContext = createContext<TMessagesContext>({
    messages: [],
    addMessage: () => null,
    removeMessage: () => null,
    updateMessage: () => null,
});

export const MessagesContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [messages, setMessages] = useState<TMessagesContext["messages"]>([
        {
            id: nanoid(),
            isUserMessage: false,
            text: "Hello, how can I help you?",
        },
    ]);

    const addMessage: TMessagesContext["addMessage"] = useCallback(
        (message) => {
            setMessages((prev) => [...prev, message]);
        },
        []
    );

    const removeMessage: TMessagesContext["removeMessage"] = useCallback(
        (id) => {
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
        },
        []
    );

    const updateMessage: TMessagesContext["updateMessage"] = useCallback(
        (id, updateFn) => {
            setMessages((prev) =>
                prev.map((message) => {
                    if (message.id === id) {
                        return {
                            ...message,
                            text: updateFn(message.text),
                        };
                    }
                    return message;
                })
            );
        },
        []
    );

    return (
        <MessagesContext.Provider
            value={{
                messages,
                addMessage,
                removeMessage,
                updateMessage,
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
};
