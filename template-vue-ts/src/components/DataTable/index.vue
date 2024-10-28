<template>
  <n-card class="mt-16px shadow-sm" :title="title">
    <div class="flex-y-center justify-between pb-16px">
      <n-space>
        <slot name="table-left-toolbar"></slot>
      </n-space>
      <n-space>
        <slot name="table-right-toolbar"></slot>

        <n-button
          size="small"
          secondary
          @click="() => request({ page: 1, pageSize: 10 })"
        >
          <icon-mdi-refresh
            class="mr-4px text-16px"
            :class="{ 'animate-spin': loading }"
          />
          刷新表格
        </n-button>
        <column-setting secondary />
      </n-space>
    </div>

    <n-data-table />
  </n-card>
</template>

<script setup lang="ts">
import type { DataTableColumns } from "naive-ui";

interface NoxDataTableProps {
  /** 表格标题 */
  title?: string;
  /** 是否为加载中 */
  loading?: boolean;
  columns: DataTableColumns;
  request: (...arg: any[]) => Promise<any>;
}

const { title, columns, request } = defineProps<NoxDataTableProps>();
</script>
