export type ChatGPTAgent = "user" | "system";

export type ChatGPTMessage = {
    role: ChatGPTAgent;
    content: string;
}
