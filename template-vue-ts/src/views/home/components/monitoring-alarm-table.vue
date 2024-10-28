<template>
  <div>
    <div class="lt-sm:hidden">
      <n-data-table
        remote
        :columns="columns"
        :data="dataSource"
        :pagination="false"
        :row-key="rowKey"
        size="small"
        :scroll-x="600"
        :max-height="380"
      />
    </div>
    <n-scrollbar class="lt-sm:block hidden max-h-380px">
      <n-list>
        <n-list-item v-for="data in dataSource" :key="data.id">
          <n-thing :title="data.name">
            <div class="flex justify-between">
              <n-text depth="1">{{ data.content }}</n-text>
              <n-text depth="3">{{ data.time }}</n-text>
            </div>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-scrollbar>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue";
import { useHomeStore as useStore } from "../store";
import { DataTableColumns } from "naive-ui";

interface RealtimeAlarm {
  id: number;
  name: string;
  content: string;
  time: string;
}

const store = useStore();

const rowKey = (row: RealtimeAlarm) => row.id;
const columns: DataTableColumns<RealtimeAlarm> = [
  {
    title: "#",
    key: "serial",
    width: 40,
    render: (_row, index) => {
      return index % 2 === 0 ? (
        <icon-carbon-recording-filled-alt class="text-green-500" />
      ) : (
        <icon-carbon-recording-filled-alt class="text-blue-500" />
      );
    },
  },
  { title: "油站名称", key: "name" },
  { title: "报警内容", key: "content", width: 120, align: "center" },
  { title: "报警时间", key: "time", width: 180 },
];

// const data = ref([])
const loading = ref(false);
// const { data, loading } = useAsync({
//   request: store.getRealTimeAlarm,
// })

const dataSource = ref<RealtimeAlarm[]>();
const handleRealTimeAlarm = async () => {
  // loading.value = true

  try {
    const res = await store.getRealTimeAlarm();
    dataSource.value = res;
    if (!res) {
      return "fail";
    }
    return "ok";
  } catch (error: any) {
    throw new Error(error);
  }
};

let timer = ref<NodeJS.Timeout | null>(null);
async function handleOnline(): Promise<any> {
  let res = await handleRealTimeAlarm();
  if (res === "ok") {
    timer.value = setTimeout(() => {
      handleOnline();
    }, 1000 * 30);

    // clearTimeout(timer.value);
  }
  // return timer;
}

onMounted(() => {
  handleRealTimeAlarm();

  handleOnline();
});

onUnmounted(async () => {
  clearTimeout(timer.value as NodeJS.Timeout);
});
</script>
