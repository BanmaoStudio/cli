<template>
    <n-layout class="bg-transparent">
        <n-card class="flex-1 mt-12px" :title="pageTitle">
            <n-space>
                <n-select v-model:value="value" :options="options" />
                <n-input
                    v-model:value="searchValue"
                    type="text"
                    placeholder="请输入"
                    clearable
                    @keyup.enter="handleSearch"
                />
                <n-button type="primary" @click="handleSearch">查询</n-button>
            </n-space>
            <n-spin :show="loading">
                <n-flex>
                    <div>
                        <n-descriptions label-placement="left" :column="1">
                            <template #header>
                                <span style="font-size: 15px; font-weight: 600"
                                    >卡基础信息</span
                                >
                            </template>
                            <n-descriptions-item label="ICCID">
                                {{ vsimCardInfo.iccid }}
                            </n-descriptions-item>
                            <n-descriptions-item label="卡状态">
                                <public-status
                                    :text="getStatus(vsimCardInfo.status).text"
                                    :color="
                                        getStatus(vsimCardInfo.status).color
                                    "
                                />
                            </n-descriptions-item>
                            <n-descriptions-item label="具体状态">
                                <public-status
                                    :text="
                                        getOsStatus(vsimCardInfo.osStatus).text
                                    "
                                    :color="
                                        getOsStatus(vsimCardInfo.osStatus).color
                                    "
                                />
                            </n-descriptions-item>
                            <n-descriptions-item label="是否在线">
                                <span
                                    class="status-dot"
                                    :style="{
                                        backgroundColor:
                                            vsimCardInfo.online === true
                                                ? '#28a745'
                                                : vsimCardInfo.online === false
                                                  ? '#ffc107'
                                                  : vsimCardInfo.online === null
                                                    ? '#dc3545'
                                                    : ''
                                    }"
                                >
                                </span>
                                {{
                                    vsimCardInfo.online === true
                                        ? '在线'
                                        : vsimCardInfo.online === false
                                          ? '未在线'
                                          : vsimCardInfo.online === null
                                            ? '未检测到状态'
                                            : ''
                                }}
                            </n-descriptions-item>
                            <n-descriptions-item label="流量使用">
                                {{ vsimCardInfo.periodAddFlow }}
                            </n-descriptions-item>
                        </n-descriptions>
                    </div>

                    <div
                        class="card-class"
                        v-if="listPsimCards && listPsimCards.length > 0"
                    >
                        <div class="card-title">子卡诊断</div>
                        <n-flex>
                            <n-card
                                v-for="(item, index) in listPsimCards"
                                :key="index"
                            >
                                <n-descriptions
                                    label-placement="left"
                                    :column="1"
                                >
                                    <template #header>
                                        <span style="font-size: 15px">
                                            {{ item.vendor }}</span
                                        >
                                    </template>
                                    <n-descriptions-item label="ICCID">
                                        {{ item.iccid }}
                                    </n-descriptions-item>
                                    <n-descriptions-item label="卡状态">
                                        <public-status
                                            :text="getStatus(item.status).text"
                                            :color="
                                                getStatus(item.status).color
                                            "
                                        />
                                    </n-descriptions-item>
                                    <n-descriptions-item label="具体状态">
                                        <public-status
                                            :text="
                                                getOsStatus(item.osStatus).text
                                            "
                                            :color="
                                                getOsStatus(item.osStatus).color
                                            "
                                        />
                                    </n-descriptions-item>
                                    <n-descriptions-item label="是否在线">
                                        <span
                                            class="status-dot"
                                            :style="{
                                                backgroundColor:
                                                    item.online === true
                                                        ? '#28a745'
                                                        : item.online === false
                                                          ? '#ffc107'
                                                          : item.online === null
                                                            ? '#dc3545'
                                                            : ''
                                            }"
                                        >
                                        </span>
                                        {{
                                            item.online === true
                                                ? '在线'
                                                : item.online === false
                                                  ? '未在线'
                                                  : item.online === null
                                                    ? '未检测到状态'
                                                    : ''
                                        }}
                                    </n-descriptions-item>
                                    <n-descriptions-item label="流量使用">
                                        {{ item.periodAddFlow }}
                                    </n-descriptions-item>
                                </n-descriptions>
                            </n-card>
                        </n-flex>
                    </div>
                </n-flex>
            </n-spin>
        </n-card>
    </n-layout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useGetByIccIdStore } from './store'
import { useRoute } from 'vue-router'
import { ListPsimCard } from './types'
import { debounce } from 'lodash-es'
import PublicStatus from './components/PublicStatus.vue'
import {
    osStatusText,
    osStatusColor,
    statusText,
    statusColor
} from './components/PublicStyle'
defineOptions({
    name: 'IoTCardManage'
})

const vsimCardInfo = ref<ListPsimCard>({
    status: '', //卡状态
    online: '', //在线状态
    iccid: '', //ICCID
    periodAddFlow: '', //累计流量
    osStatus: '' //具体状态
})
const listPsimCards = ref<ListPsimCard>([])

const store = useGetByIccIdStore()
const value = ref(1)
const searchValue = ref('')

const route = useRoute()
const pageTitle = computed(() => {
    return (route.meta.title as string) || '物联网卡管理'
})
const options = [
    {
        label: 'ICCID',
        value: 1
    }
]

const loading = ref(false)
const handleIccIdData = debounce(() => {
    loading.value = true
    store
        .iccIdData({ IccId: searchValue.value })
        .then((res) => {
            if (res?.data) {
                listPsimCards.value = res.data.listPsimCards
                vsimCardInfo.value = res.data.vsimCardInfo
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            loading.value = false
        })
}, 500)

function handleSearch() {
    // 实际的搜索逻辑
    handleIccIdData()
}

function getStatus(status) {
    return { text: statusText[status], color: statusColor[status] }
}

function getOsStatus(osStatus) {
    return { text: osStatusText[osStatus], color: osStatusColor[osStatus] }
}

// 具体状态
</script>
<style lang="scss" scoped>
.card-class {
    margin-left: 80px;

    .card-title {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    :deep(.n-card) {
        width: 360px;
        box-shadow:
            0 4px 12px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.1);
    }
}

.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
}
</style>
