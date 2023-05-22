import { chatbotPrompt } from "@/lib/chatbot-prompt";
import { MessageArraySchema } from "@/lib/validators/message";
import { OpenAI } from "openai-streams";
import type { CreateChatCompletionRequest } from "openai-streams";
import type { NextRequest } from "next/server";
import { OPENAI_API_KEY } from "@/envVars";

export async function POST(req: NextRequest) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

    const stream = await OpenAI("chat", payload, { apiKey: OPENAI_API_KEY });

    return new Response(stream);
}
