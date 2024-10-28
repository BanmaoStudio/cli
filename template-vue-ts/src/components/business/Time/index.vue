<template>
  <span>{{ nowTime }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNow } from "@vueuse/core";
import dayjs from "dayjs";

const now = useNow();

const nowTime = computed(() => {
  return dayjs(now.value).format("YYYY年MM月DD日 hh:mm:ss");
});
</script>
