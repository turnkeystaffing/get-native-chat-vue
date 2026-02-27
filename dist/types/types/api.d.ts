export interface ConversationResponse {
    id: string;
    createdAt: string;
}
export interface ConversationListResponse {
    conversations: ConversationResponse[];
    hasMore: boolean;
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
    hasMore: boolean;
}
export interface SendMessageResponse {
    userMessage: MessageResponse;
    assistantMessage: MessageResponse;
}
export interface RawConversationResponse {
    conversation_id: string;
    created_at: string;
    updated_at: string;
    user_id?: string;
}
export interface RawConversationListResponse {
    items: Array<{
        conversation_id: string;
        created_at: string;
        updated_at: string;
    }>;
    pagination: {
        has_more: boolean;
        offset: number;
        limit: number;
    };
}
export interface RawSendMessageResponse {
    user_message_id: string;
    user_message: string;
    assistant_message_id: string;
    assistant_response: string;
    conversation_id: string;
    timestamp: string;
}
export interface RawMessageHistoryResponse {
    items: Array<{
        message_id: string;
        content: string;
        sender: 'user' | 'assistant';
        created_at: string;
        sequence: number;
    }>;
    pagination: {
        has_more: boolean;
        offset: number;
        limit: number;
    };
}
export interface NativeChatApiClient {
    createConversation(): Promise<ConversationResponse>;
    getConversations(offset: number, limit: number): Promise<ConversationListResponse>;
    getMessages(conversationId: string, offset: number, limit: number): Promise<MessageHistoryResponse>;
    sendMessage(conversationId: string, message: string): Promise<SendMessageResponse>;
}
//# sourceMappingURL=api.d.ts.map