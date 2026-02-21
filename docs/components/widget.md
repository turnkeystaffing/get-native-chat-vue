# Chat Widget Demo

Interactive demo of the full `<NativeChatWidget />` component with mock API responses.

<script setup>
import DemoBlock from '../.vitepress/components/DemoBlock.vue'
import WidgetDemoSource from './demos/WidgetDemo.vue?raw'
import WidgetDemo from './demos/WidgetDemo.vue'
</script>

<ClientOnly>
  <DemoBlock :source="WidgetDemoSource">
    <WidgetDemo />
  </DemoBlock>
</ClientOnly>
