<template>
  <hover-container
    class="w-64px h-full"
    tooltip-content="重新加载"
    placement="bottom-end"
    @click="handleRefresh"
  >
    <icon-mdi-refresh class="text-22px" :class="{ 'animate-spin': loading }" />
  </hover-container>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";
import { useLoading } from "@/hooks";

defineOptions({ name: "ReloadButton" });

const app = useAppStore();
const { loading, setLoading } = useLoading();

function handleRefresh() {
  setLoading(true);
  app.reloadPage();
  setTimeout(() => {
    setLoading(false);
  }, 1000);
}
</script>

<style scoped></style>
