<template>
  <div
    class="flex justify-around py-16px overflow-hidden bg-[#fff] dark:bg-[#18181c] shadow-sm border-rd-4px"
  >
    <div class="flex items-center h-100px">
      <img class="w-100px" :src="data.img" />
    </div>

    <div class="flex flex-col">
      <div
        class="text-20px font-bold-[400] letter-spacing-2px text-[#333333] dark:text-[#fefeff]"
      >
        {{ data.title }}({{ data.unit }})
      </div>
      <span class="text-40px font-bold-[400] text-[#195fff]">{{
        data.value
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatisticData {
  title: string;
  value: number;
  unit: string;
  img: string;
}

interface StatisticProps {
  data: StatisticData;
}

const { data } = defineProps<StatisticProps>();
</script>
