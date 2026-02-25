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

The package provides a convenience helper that delegates all HTTP calls through a pre-configured Axios instance:

```ts
import axios from 'axios'
import { createNativeChatApiClient } from 'native-chat-vue'

const axiosInstance = axios.create({ baseURL: 'https://api.example.com' })
// Add interceptors for auth, retry, error handling, etc.
// axiosInstance.interceptors.request.use(...)

const apiClient = createNativeChatApiClient({ axiosInstance })
```

### How It Works

- Delegates all HTTP requests through the provided Axios instance
- Uses `axiosInstance.get()` and `axiosInstance.post()` — auth, headers, and retry logic are handled by your Axios interceptors
- Passes only relative paths (`/conversations`, `/conversations/:id/messages`) — URL resolution to `baseURL` is Axios's responsibility
- Uses Axios `params` option for query parameters
- Returns `response.data` directly (Axios auto-parses JSON)
- Lets Axios errors propagate naturally — no wrapping or `.statusCode` attachment

### URL Patterns

The helper passes relative paths to the Axios instance. The final URL is resolved by Axios against the instance's `baseURL`:

| Method                            | HTTP Verb | Path                                                   |
| --------------------------------- | --------- | ------------------------------------------------------ |
| `createConversation()`            | POST      | `/conversations`                                       |
| `getConversations(offset, limit)` | GET       | `/conversations` (params: offset, limit)               |
| `getMessages(id, offset, limit)`  | GET       | `/conversations/{id}/messages` (params: offset, limit) |
| `sendMessage(id, message)`        | POST      | `/conversations/{id}/messages`                         |

## Custom Implementation

If you prefer not to use Axios, implement the `NativeChatApiClient` interface directly with `fetch` or any other HTTP library:

```ts
import type { NativeChatApiClient } from 'native-chat-vue'

const customApiClient: NativeChatApiClient = {
  async createConversation() {
    const res = await fetch('/api/conversations', { method: 'POST' })
    if (!res.ok) throw Object.assign(new Error(res.statusText), { statusCode: res.status })
    return res.json()
  },

  async getConversations(offset, limit) {
    const res = await fetch(`/api/conversations?offset=${offset}&limit=${limit}`)
    if (!res.ok) throw Object.assign(new Error(res.statusText), { statusCode: res.status })
    return res.json()
  },

  async getMessages(conversationId, offset, limit) {
    const res = await fetch(
      `/api/conversations/${encodeURIComponent(conversationId)}/messages?offset=${offset}&limit=${limit}`,
    )
    if (!res.ok) throw Object.assign(new Error(res.statusText), { statusCode: res.status })
    return res.json()
  },

  async sendMessage(conversationId, message) {
    const res = await fetch(`/api/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) throw Object.assign(new Error(res.statusText), { statusCode: res.status })
    return res.json()
  },
}
```

Each method must return a promise resolving to the correct response type. The plugin does not validate response shapes at runtime — ensure your backend returns data matching the interfaces above.

::: tip Automatic Axios error support
When using the built-in helper with an Axios instance, error status codes are automatically extracted from `error.response.status`. No manual `.statusCode` attachment is needed — the plugin handles both Axios errors and custom `error.statusCode` for backward compatibility.
:::

## Error Contract

When an API call fails, the plugin extracts the HTTP status code from the error to map it to a user-friendly message. Two error shapes are supported:

| Error Shape           | How Status Code Is Extracted |
| --------------------- | ---------------------------- |
| Axios error           | `error.response.status`      |
| Custom / legacy error | `error.statusCode`           |

If both properties exist, `error.response.status` takes priority.

The plugin maps status codes to user-friendly error messages:

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
