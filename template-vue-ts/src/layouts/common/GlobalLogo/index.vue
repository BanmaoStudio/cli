<template>
  <div class="flex-center nowrap-hidden text-[#1890ff]">
    <system-logo class="text-32px text-primary" />
    <h2
      v-show="showTitle"
      class="pl-8px text-16px font-bold text-primary transition duration-300 ease-in-out"
    >
      {{ title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
// import { routePath } from '@/router';
// import { t, setLocale } from '@/locales';

defineOptions({ name: "GlobalLogo" });

interface Props {
  /** 显示名字 */
  showTitle: boolean;
}

defineProps<Props>();

const title = import.meta.env.VITE_APP_TITLE;

// const routeHomePath = routePath('root');

const routeHomePath = "/";

// let flag = true;
// function toggleLocal() {
// flag = !flag;
// setLocale(flag ? 'en' : 'zh-CN');
// }
</script>

<style scoped></style>
