# Full Widget Demo

Interactive demo of the complete `<NativeChatWidget />` component with mock API responses.

The widget renders as a floating button anchored to the bottom-right of the viewport. Click it to open the chat panel where you can:

- **Send messages** and receive simulated assistant responses
- **Scroll through history** with infinite scroll loading
- **Trigger errors** using the error simulation controls below

## Live Widget

The chat widget is already active on this page — look for the floating button in the bottom-right corner.

<script setup lang="ts">
import DemoBlock from '../.vitepress/components/DemoBlock.vue'
import WidgetDemoSource from './demos/WidgetDemo.vue?raw'
import WidgetDemo from './demos/WidgetDemo.vue'
import WidgetErrorDemoSource from './demos/WidgetErrorDemo.vue?raw'
import WidgetErrorDemo from './demos/WidgetErrorDemo.vue'
</script>

<ClientOnly>
  <DemoBlock :source="WidgetDemoSource">
    <WidgetDemo />
  </DemoBlock>
</ClientOnly>

## Error Simulation

Use the controls below to simulate API errors. When an error mode is active, the next message you send will trigger that error — the widget will display the error as a calm chat message with retry support.

<ClientOnly>
  <DemoBlock :source="WidgetErrorDemoSource">
    <WidgetErrorDemo />
  </DemoBlock>
</ClientOnly>
