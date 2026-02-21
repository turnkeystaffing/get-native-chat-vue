# API Client

The plugin communicates with your backend through a `NativeChatApiClient` interface. You can use the built-in `createNativeChatApiClient` helper or provide your own implementation.

## `NativeChatApiClient` Interface

The interface defines four methods:

```ts
import type { NativeChatApiClient } from 'native-chat-vue'

interface NativeChatApiClient {
  createConversation(): Promise<ConversationResponse>
  getConversations(offset: number, limit: number): Promise<ConversationListResponse>
  getMessages(
    conversationId: string,
    offset: number,
    limit: number,
  ): Promise<MessageHistoryResponse>
  sendMessage(conversationId: string, message: string): Promise<SendMessageResponse>
}
```

## Response Types

All response types are exported from the package:

```ts
import type {
  ConversationResponse,
  ConversationListResponse,
  MessageResponse,
  MessageHistoryResponse,
  SendMessageResponse,
} from 'native-chat-vue'
```

### `ConversationResponse`

```ts
interface ConversationResponse {
  id: string
  createdAt: string
}
```

### `ConversationListResponse`

```ts
interface ConversationListResponse {
  conversations: ConversationResponse[]
  has_more: boolean
}
```

### `MessageResponse`

```ts
interface MessageResponse {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}
```

### `MessageHistoryResponse`

```ts
interface MessageHistoryResponse {
  messages: MessageResponse[]
  has_more: boolean
}
```

### `SendMessageResponse`

```ts
interface SendMessageResponse {
  userMessage: MessageResponse
  assistantMessage: MessageResponse
}
```

### `ChatMessage`

The plugin's internal message representation, useful if you work with the chat state directly:

```ts
interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  status?: MessageStatus
}
```

### `MessageStatus`

```ts
type MessageStatus = 'sending' | 'sent' | 'failed'
```

## Built-in Helper: `createNativeChatApiClient`

The package provides a `fetch`-based client out of the box:

```ts
import { createNativeChatApiClient } from 'native-chat-vue'

const apiClient = createNativeChatApiClient({
  baseUrl: 'https://api.example.com',
  getAccessToken: () => authStore.token,
})
```

### How It Works

- Calls `getAccessToken()` before every request (supports both sync and async return values)
- Adds an `Authorization: Bearer <token>` header to all requests
- Sets `Content-Type: application/json` for requests with a body
- Throws an `Error` with a `.statusCode` property on non-ok HTTP responses

### URL Patterns

The helper constructs the following endpoints from the `baseUrl`:

| Method                            | HTTP Verb | Endpoint                                                 |
| --------------------------------- | --------- | -------------------------------------------------------- |
| `createConversation()`            | POST      | `{baseUrl}/conversations`                                |
| `getConversations(offset, limit)` | GET       | `{baseUrl}/conversations?offset=…&limit=…`               |
| `getMessages(id, offset, limit)`  | GET       | `{baseUrl}/conversations/{id}/messages?offset=…&limit=…` |
| `sendMessage(id, message)`        | POST      | `{baseUrl}/conversations/{id}/messages`                  |

## Custom Implementation

If you need features like retry logic, custom headers, or a different HTTP library, implement the `NativeChatApiClient` interface directly:

```ts
import type { NativeChatApiClient } from 'native-chat-vue'
import axios from 'axios'

function rethrowWithStatusCode(err: unknown): never {
  if (axios.isAxiosError(err) && err.response) {
    const error = new Error(err.message)
    ;(error as Error & { statusCode: number }).statusCode = err.response.status
    throw error
  }
  throw err
}

const customApiClient: NativeChatApiClient = {
  async createConversation() {
    try {
      const res = await axios.post('/api/conversations')
      return res.data
    } catch (err) {
      rethrowWithStatusCode(err)
    }
  },

  async getConversations(offset, limit) {
    try {
      const res = await axios.get('/api/conversations', {
        params: { offset, limit },
      })
      return res.data
    } catch (err) {
      rethrowWithStatusCode(err)
    }
  },

  async getMessages(conversationId, offset, limit) {
    try {
      const res = await axios.get(`/api/conversations/${conversationId}/messages`, {
        params: { offset, limit },
      })
      return res.data
    } catch (err) {
      rethrowWithStatusCode(err)
    }
  },

  async sendMessage(conversationId, message) {
    try {
      const res = await axios.post(`/api/conversations/${conversationId}/messages`, { message })
      return res.data
    } catch (err) {
      rethrowWithStatusCode(err)
    }
  },
}
```

Each method must return a promise resolving to the correct response type. The plugin does not validate response shapes at runtime — ensure your backend returns data matching the interfaces above.

::: tip Error contract compliance
The `rethrowWithStatusCode` helper above ensures Axios errors are re-thrown with a `.statusCode` property, which the plugin needs for [status code mapping](#error-contract). Without this, all errors would show a generic message.
:::

## Error Contract

When an API call fails, the client should throw an `Error` with a `.statusCode` property set to the HTTP status code. The plugin maps these codes to user-friendly error messages:

| Status Code  | Error Message                   |
| ------------ | ------------------------------- |
| `429`        | Rate limit — try again later    |
| `503`, `504` | Service temporarily unavailable |
| Other codes  | A generic error message         |

The plugin also calls the `onError` callback (if [configured](./configuration.md)) with a `ChatError` object containing the message, status code, and original error.

## Message Ordering

::: warning Important
`getMessages()` must return messages **newest-first** (most recent message at index 0). The plugin reverses messages internally for chronological display.
:::

When `has_more` is `true`, older messages exist beyond the current `offset`. The plugin loads them automatically when the user scrolls to the top of the chat history.

## Next Steps

- [Getting Started](./getting-started.md) — installation and basic setup
- [Configuration](./configuration.md) — all plugin options and examples
