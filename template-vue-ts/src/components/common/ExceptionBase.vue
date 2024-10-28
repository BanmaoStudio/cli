<template>
  <div class="h-screen flex-center justify-center">
    <div class="fof">
      <h1 class="mb-30px">Error {{ type }}</h1>

      <n-button @click="handleGoBack">返回首页</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { routeName } from '@/router';
import { useRouter } from "vue-router";

defineOptions({ name: "ExceptionBase" });

type ExceptionType = "403" | "404" | "500";

interface Props {
  /** 异常类型 403 404 500 */
  type: ExceptionType;
}

defineProps<Props>();

const router = useRouter();
const routeHomePath = "/";

const handleGoBack = () => {
  router.push(routeHomePath);
};
</script>

<style scoped>
.fof {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.fof h1 {
  font-size: 50px;
  display: inline-block;
  padding-right: 12px;
  animation: type 0.5s alternate infinite;
}

@keyframes type {
  from {
    box-shadow: inset -3px 0px 0px #888;
  }
  to {
    box-shadow: inset -3px 0px 0px transparent;
  }
}
</style>
