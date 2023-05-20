import { chatbotPrompt } from "@/lib/chatbot-prompt";
import { CreateChatCompletionRequest } from "openai";
import { MessageArraySchema } from "@/lib/validators/message";
import { OpenAI } from "openai-streams";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { messages } = await req.json();
    const parsedMessages = MessageArraySchema.parse(messages);

    const outboundMessages: CreateChatCompletionRequest["messages"] =
        parsedMessages.map((message) => ({
            role: message.isUserMessage ? "user" : "system",
            content: message.text,
        }));

    outboundMessages.unshift({
        role: "system",
        content: chatbotPrompt,
    });

    const payload: CreateChatCompletionRequest = {
        model: "gpt-3.5-turbo",
        messages: outboundMessages,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1,
    };

    const stream = await OpenAI("chat", payload);

    return new Response(stream);
}
