<template>
  <n-layout class="bg-transparent" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useHomeStore } from "./store";

const router = useRouter();
const store = useHomeStore();

const routerPush = (path: string, id: number) => {
  router.push({
    path,
    query: {
      id,
    },
  });
};

</script>
