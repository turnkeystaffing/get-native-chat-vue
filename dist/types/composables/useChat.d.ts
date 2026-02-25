import { Ref, DeepReadonly } from 'vue';
import { NativeChatApiClient } from '../types/api';
import { NativeChatPluginOptions } from '../types/config';
import { ChatMessage } from '../types/chat';
export interface UseChatReturn {
    messages: DeepReadonly<Ref<ChatMessage[]>>;
    isOpen: Readonly<Ref<boolean>>;
    isLoading: Readonly<Ref<boolean>>;
    isSending: Readonly<Ref<boolean>>;
    hasMore: Readonly<Ref<boolean>>;
    failedMessageText: Readonly<Ref<string | null>>;
    open(): Promise<void>;
    close(): void;
    sendMessage(text: string): Promise<void>;
    loadMore(): Promise<void>;
    retry(): Promise<void>;
}
export declare function extractStatusCode(error: unknown): number | undefined;
export declare function useChat(apiClient: NativeChatApiClient, config: NativeChatPluginOptions): UseChatReturn;
//# sourceMappingURL=useChat.d.ts.map