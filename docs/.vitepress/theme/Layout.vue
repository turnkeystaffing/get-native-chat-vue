<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import NativeChatWidget from '@/components/NativeChatWidget.vue'

const { Layout } = DefaultTheme

// Render widget only client-side to avoid SSR issues (DOMPurify, plugin inject)
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <v-app>
    <Layout>
      <template #layout-bottom>
        <NativeChatWidget v-if="mounted" />
      </template>
    </Layout>
  </v-app>
</template>
