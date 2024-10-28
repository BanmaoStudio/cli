<template>
  <NPopover placement="bottom" trigger="click">
    <template #trigger>
      <NButton size="small" type="warning" :secondary="secondary !== false">
        <icon-ant-design-setting-outlined class="mr-4px text-16px" />
        表格列设置
      </NButton>
    </template>
    <div class="w-210px">
      <vue-draggable v-model="list" item-key="key">
        <template #item="{ element }">
          <div
            v-if="element.type === 'selection'"
            class="flex-y-center h-36px px-12px hover:bg-primary_active"
          >
            <icon-mdi-drag class="mr-8px text-20px cursor-move" />
            <NCheckbox v-model:checked="element.checked"> 多选框 </NCheckbox>
          </div>
          <div
            v-else-if="element.key"
            class="flex-y-center h-36px px-12px hover:bg-primary_active"
          >
            <icon-mdi-drag class="mr-8px text-20px cursor-move" />
            <NCheckbox v-model:checked="element.checked">
              {{ element.title }}
            </NCheckbox>
          </div>
        </template>
      </vue-draggable>
    </div>
  </NPopover>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { DataTableColumn } from "naive-ui";
import VueDraggable from "vuedraggable";

type Column = DataTableColumn<any>;

interface Props {
  columns: Column[];
  secondary?: boolean;
}

const props = defineProps<Props>();

interface Emits {
  (e: "update:columns", columns: Column[]): void;
}

const emit = defineEmits<Emits>();

type List = Column & { checked?: boolean };

const list = ref(initList());

function initList(): List[] {
  return props.columns.map((item) => ({ ...item, checked: true }));
}

watch(
  list,
  (newValue) => {
    const newColumns = newValue.filter((item) => item.checked);

    const columns: Column[] = newColumns.map((item) => {
      const column = { ...item };
      delete column.checked;

      return column;
    }) as Column[];

    emit("update:columns", columns);
  },
  {
    deep: true,
  },
);
</script>
