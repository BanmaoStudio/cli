<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="flex-center text-18px cursor-pointer" @click="handleLogout">
        <icon-ant-design-logout-outlined />
      </div>
    </template>
  </n-tooltip>
</template>

<script setup lang="ts">
import { localStg } from "@/utils";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store";

defineOptions({ name: "Logout" });

const router = useRouter();

const authStore = useAuthStore();

const handleLogout = () => {
  // localStg.clear()
  // router.replace('/login')
  authStore.resetAuthStore();
};
</script>
