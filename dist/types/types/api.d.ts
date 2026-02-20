export interface ConversationResponse {
    id: string;
    createdAt: string;
}
export interface ConversationListResponse {
    conversations: ConversationResponse[];
    has_more: boolean;
}
export interface MessageResponse {
    id: string;
    conversationId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}
export interface MessageHistoryResponse {
    messages: MessageResponse[];
    has_more: boolean;
}
export interface SendMessageResponse {
    userMessage: MessageResponse;
    assistantMessage: MessageResponse;
}
export interface NativeChatApiClient {
    createConversation(): Promise<ConversationResponse>;
    getConversations(offset: number, limit: number): Promise<ConversationListResponse>;
    getMessages(conversationId: string, offset: number, limit: number): Promise<MessageHistoryResponse>;
    sendMessage(conversationId: string, message: string): Promise<SendMessageResponse>;
}
//# sourceMappingURL=api.d.ts.map