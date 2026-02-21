# Configuration

The plugin accepts a `NativeChatPluginOptions` object when registered with `app.use()`. Only `apiClient` is required — all other properties have sensible defaults.

## Options Reference

| Property         | Type                              | Required | Default                        | Description                                      |
| ---------------- | --------------------------------- | -------- | ------------------------------ | ------------------------------------------------ |
| `apiClient`      | `NativeChatApiClient`             | Yes      | —                              | API client instance for server communication     |
| `position`       | `'bottom-left' \| 'bottom-right'` | No       | `'bottom-right'`               | Floating button screen position                  |
| `welcomeMessage` | `string`                          | No       | `'Hello! How can I help you?'` | Text shown in the empty chat state               |
| `batchSize`      | `number`                          | No       | `20`                           | Number of messages loaded per pagination request |
| `conversationId` | `string`                          | No       | —                              | Resume a specific conversation on load           |
| `onError`        | `(error: ChatError) => void`      | No       | —                              | Callback invoked when a chat error occurs        |

## `ChatError` Type

The `onError` callback receives a `ChatError` object:

```ts
import type { ChatError } from 'native-chat-vue'

interface ChatError {
  message: string
  statusCode?: number
  originalError?: unknown
}
```

- `message` — a user-friendly error description
- `statusCode` — the HTTP status code, if the error originated from an API call
- `originalError` — the underlying error object for debugging

## Examples

### Custom Position

Place the floating button on the bottom-left corner:

```ts
app.use(NativeChatPlugin, {
  apiClient,
  position: 'bottom-left',
})
```

### Custom Welcome Message

```ts
app.use(NativeChatPlugin, {
  apiClient,
  welcomeMessage: 'Welcome! Ask me anything about your account.',
})
```

### Error Callback

Use `onError` to log errors or send them to an analytics service:

```ts
app.use(NativeChatPlugin, {
  apiClient,
  onError: (error) => {
    console.error('[Chat Error]', error.message, error.statusCode)
    analytics.track('chat_error', {
      message: error.message,
      statusCode: error.statusCode,
    })
  },
})
```

### Resuming a Conversation

Pass a `conversationId` to open a specific conversation when the widget loads:

```ts
app.use(NativeChatPlugin, {
  apiClient,
  conversationId: 'conv_abc123',
})
```

## Config Validation

When `apiClient` is missing or falsy, the plugin logs a descriptive warning and returns early from `install()`:

```
[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped.
```

No component is registered and no error is thrown. The host application continues to function normally.

## Full Configuration Example

```ts
import { NativeChatPlugin, createNativeChatApiClient } from 'native-chat-vue'
import type { ChatError } from 'native-chat-vue'

const apiClient = createNativeChatApiClient({
  baseUrl: 'https://api.example.com',
  getAccessToken: () => authStore.token,
})

app.use(NativeChatPlugin, {
  apiClient,
  position: 'bottom-left',
  welcomeMessage: 'Hi there! How can I help?',
  batchSize: 50,
  conversationId: savedConversationId,
  onError: (error: ChatError) => {
    errorReporter.captureError(error)
  },
})
```

## Next Steps

- [API Client](./api-client.md) — learn how the API client works and how to provide a custom implementation
- [Getting Started](./getting-started.md) — go back to the installation guide
