export type MessageStatus = 'sending' | 'sent' | 'failed';
export interface ChatMessage {
    id: string;
    conversationId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
    status?: MessageStatus;
}
export interface ChatError {
    message: string;
    statusCode?: number;
    originalError?: unknown;
}
//# sourceMappingURL=chat.d.ts.map