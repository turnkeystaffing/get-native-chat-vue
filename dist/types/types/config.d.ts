import { NativeChatApiClient } from './api';
import { ChatError } from './chat';
export interface NativeChatPluginOptions {
    apiClient: NativeChatApiClient;
    position?: 'bottom-left' | 'bottom-right';
    welcomeMessage?: string;
    batchSize?: number;
    conversationId?: string;
    onError?: (error: ChatError) => void;
}
//# sourceMappingURL=config.d.ts.map