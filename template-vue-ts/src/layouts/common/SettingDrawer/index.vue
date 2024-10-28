<template>
  <n-drawer
    :show="app.settingDrawerVisible"
    display-directive="show"
    :width="330"
    @mask-click="app.closeSettingDrawer"
  >
    <n-drawer-content title="主题配置" :native-scrollbar="false" />
  </n-drawer>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store";

defineOptions({ name: "SettingDrawer" });

const app = useAppStore();
</script>
