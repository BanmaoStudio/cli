<template>
  <n-button size="small" secondary>
    <icon-mdi-refresh
      class="mr-4px text-16px"
      :class="{ 'animate-spin': loading }"
    />
    刷新表格
  </n-button>
</template>

<script setup lang="ts">
defineOptions({ name: "RefreshButton" });

interface RefreshButtonProps {
  loading: boolean;
}

const { loading } = defineProps<RefreshButtonProps>();
</script>
