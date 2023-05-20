import { chatbotPrompt } from "@/lib/chatbot-prompt";
import { ChatGPTMessage } from "@/lib/openai-stream";
import { MessageArraySchema } from "@/lib/validators/message";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { messages } = await req.json();
    const parsedMessages = MessageArraySchema.parse(messages);

    const outboundMessages: ChatGPTMessage[] = parsedMessages.map(
        (message) => ({
            role: message.isUserMessage ? "user" : "system",
            content: message.text,
        })
    );

    outboundMessages.unshift({
        role: "system",
        content: chatbotPrompt
    })
}
