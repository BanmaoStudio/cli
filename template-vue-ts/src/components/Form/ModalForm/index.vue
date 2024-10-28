<template>
  <n-modal>
    <n-form ref="modalFormRef">
      <n-form-item label="加油站名称">
        <n-select v-model:value="searchParams.stationId" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const searchParams = ref({
  stationId: "",
});

const modalFormRef = ref();
</script>
