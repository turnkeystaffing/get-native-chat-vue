# Getting Started

## Prerequisites

Before installing Native Chat Vue, ensure your project has:

- **Vue 3.5+** — `vue ^3.5`
- **Vuetify 3.11+** — `vuetify ^3.11`, installed and configured with `createVuetify()`

The host application must already have Vuetify set up (theme, icons, etc.) before adding the chat plugin.

## Installation

::: code-group

```sh [yarn]
yarn add native-chat-vue
```

```sh [npm]
npm install native-chat-vue
```

```sh [pnpm]
pnpm add native-chat-vue
```

:::

`vue` and `vuetify` are peer dependencies — they are not bundled with the plugin.

## Plugin Registration

Register the plugin in your application entry point:

```ts
// main.ts
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { NativeChatPlugin, createNativeChatApiClient } from 'native-chat-vue'
import 'vuetify/styles'
import 'native-chat-vue/style.css'
import App from './App.vue'

const vuetify = createVuetify()

const apiClient = createNativeChatApiClient({
  baseUrl: 'https://api.example.com',
  getAccessToken: () => authStore.token,
})

const app = createApp(App)
app.use(vuetify)
app.use(NativeChatPlugin, { apiClient })
app.mount('#app')
```

If `apiClient` is missing from the options, the plugin logs a `console.warn` and skips registration — no error is thrown and the host app continues normally.

`NativeChatPlugin` is also available as the default export:

```ts
import NativeChatPlugin from 'native-chat-vue'
```

## Template Placement

Add `<NativeChatWidget />` to your root template. The component is registered globally by the plugin, so no explicit import is needed:

```vue
<!-- App.vue -->
<template>
  <v-app>
    <router-view />
    <NativeChatWidget />
  </v-app>
</template>
```

The widget renders a floating action button that opens a chat panel when clicked.

## Complete Example

Here is a minimal working integration:

::: code-group

```ts [main.ts]
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { NativeChatPlugin, createNativeChatApiClient } from 'native-chat-vue'
import 'vuetify/styles'
import 'native-chat-vue/style.css'
import App from './App.vue'

const vuetify = createVuetify()

const apiClient = createNativeChatApiClient({
  baseUrl: 'https://api.example.com',
  getAccessToken: () => localStorage.getItem('auth_token') ?? '',
})

const app = createApp(App)
app.use(vuetify)
app.use(NativeChatPlugin, { apiClient })
app.mount('#app')
```

```vue [App.vue]
<template>
  <v-app>
    <v-main>
      <h1>My Application</h1>
    </v-main>
    <NativeChatWidget />
  </v-app>
</template>
```

:::

## SSR Compatibility

The widget uses browser APIs (`window`, `document`) and is not SSR-safe out of the box. In SSR frameworks like Nuxt, wrap the widget in a client-only guard:

```vue
<ClientOnly>
  <NativeChatWidget />
</ClientOnly>
```

If you configure VitePress or another Vite-based SSR setup, add Vuetify to the SSR exclusion list in your Vite config:

```ts
ssr: {
  noExternal: ['vuetify'],
}
```

## Next Steps

- [Configuration](./configuration.md) — customize position, welcome message, error handling, and more
- [API Client](./api-client.md) — learn about the API client interface and how to provide a custom implementation
