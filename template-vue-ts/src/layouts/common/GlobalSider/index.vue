<template>
  <n-layout-sider
    collapse-mode="width"
    :collapse-width="64"
    :width="240"
    show-trigger="arrow-circle"
    bordered
    @update:collapsed="
      (e) => {
        showTitle = !e;
      }
    "
  >
    <global-logo
      v-if="hasTitle"
      :show-title="showTitle"
      :style="{ height: theme.header.height + 'px' }"
    />
    <vertical-menu />
  </n-layout-sider>
</template>

<script setup lang="tsx">
// import { computed } from 'vue'
import { useThemeStore } from "@/store";
import { GlobalLogo } from "@/layouts/common";
import { ref } from "vue";
import { VerticalMenu } from "./components";

interface GlobalSiderProps {
  hasTitle?: boolean;
}

defineOptions({ name: "GlobalSider" });

const { hasTitle } = defineProps<GlobalSiderProps>();

// const app = useAppStore()
const theme = useThemeStore();

const showTitle = ref(true);

// const showTitle = computed(() => !app.siderCollapse && theme.layout.mode !== 'vertical-mix')
</script>
