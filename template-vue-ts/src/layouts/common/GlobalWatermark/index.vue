<template>
  <n-watermark
    :content="props.content"
    cross
    fullscreen
    font-color="rgba(128, 128, 128, .05)"
    :font-size="16"
    :line-height="16"
    :width="600"
    :height="200"
    :x-offset="12"
    :y-offset="60"
    :rotate="-10"
  />
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
defineOptions({ name: "GlobalWatermark" });

interface Props {
  /** 水印文字内容 */
  content?: string;
}

const props = withDefaults(defineProps<Props>(), {
  content: "Nox Admin Template",
});
</script>
