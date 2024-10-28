<template>
    <n-layout class="bg-transparent">
        <n-card>
            <n-form
                label-placement="left"
                :show-feedback="false"
                :show-require-mark="false"
            >
                <n-grid x-gap="30" :cols="3" y-gap="20">
                    <n-form-item-gi label="加油站名称:">
                        <n-select
                            filterable
                            v-model:value="searchParams.siteId"
                            :options="siteOptions"
                            clearable
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="设备编号:">
                        <n-input
                            v-model:value="searchParams.skDeviceSn"
                            type="text"
                            placeholder="请输入设备编号"
                            clearable
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="油枪编号:">
                        <n-input
                            v-model:value="searchParams.gunNo"
                            type="text"
                            placeholder="请输入油枪编号"
                            clearable
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="上传时间:">
                        <n-date-picker
                            v-model:formatted-value="searchParams.skUpTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            :is-date-disabled="disableNonCurrentMonthDates"
                        />
                    </n-form-item-gi>

                    <n-gi suffix>
                        <n-space justify="end">
                            <n-button type="info" @click="handleSearch"
                                >搜索</n-button
                            >
                            <n-button
                                strong
                                secondary
                                type="tertiary"
                                @click="handleReset"
                                >重置</n-button
                            >
                        </n-space>
                    </n-gi>
                </n-grid>
            </n-form>
        </n-card>
        <pro-table
            :page-title="pageTitle"
            :columns="columns"
            :loading="loading"
            :data-source="dataSource"
            :row-key="rowKey"
            @load-data="loadData"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            :pagination="pagination"
        />
    </n-layout>
</template>
<script setup lang="tsx">
import { ref } from 'vue'
import { useFuelDispenserFlow } from './store'
import { useList } from '@/hooks'
import { FuelDispenserFlowRequest, FuelDispenserFlowItem } from './types'
import { fetchFuelStationList } from '@/services'
import dayjs from 'dayjs'
import { columns } from './columns'
import { useRoute } from 'vue-router'

import { SelectOption } from 'naive-ui'

type RowData = FuelDispenserFlowItem
const route = useRoute()

const range = ref<any>([Date.now(), Date.now()])

const pageTitle = computed(() => {
    return (route.meta.title as string) || '加油机流水'
})
const rowKey = (row: RowData) => row.id

// 当前时间
const now = dayjs()
const currentYear = now.year()
const currentMonth = now.month()

// 定义禁用非当前月份的日期
const disableNonCurrentMonthDates = (date: any) => {
    // 检查日期是否为 Date 对象，如果不是，转为 Date 对象
    const parsedDate = date instanceof Date ? date : new Date(date)

    // 返回是否禁用非当前月份的日期
    return (
        parsedDate.getFullYear() !== currentYear ||
        parsedDate.getMonth() !== currentMonth
    )
}

type SearchParams = Omit<FuelDispenserFlowRequest, 'pageNum' | 'pageSize'>

const searchParams = ref<SearchParams>({
    siteId: '',
    skDeviceSn: '',
    skUpTime: dayjs().format('YYYY-MM-DD'),
    gunNo: ''
})
const store = useFuelDispenserFlow()

/** 获取列表数据 */
const {
    dataSource,
    loading,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    loadData
} = useList<any>(store.getDataList, {
    filterOption: searchParams
})

// 获取加油站列表数据
const siteOptions = ref<SelectOption[]>([])

const loadAllStationData = async () => {
    try {
        const { data, status } = await fetchFuelStationList()

        if (status === 0) {
            const transformedData = data.map(
                (item: { name: string; id: number }) => ({
                    label: item.name,
                    value: item.id
                })
            )
            siteOptions.value = transformedData
            console.log('data', siteOptions.value)
        } else {
            siteOptions.value = []
            searchParams.value.siteId = ''
        }
    } catch (error) {
        throw new Error(error as string)
    }
}
loadAllStationData()

// 搜索
const handleSearch = () => {
    loadData()
}

// 重置
const handleReset = () => {
    range.value = [Date.now(), Date.now()]
    const defaultSearchParams = {
        siteId: '',
        skDeviceSn: '',
        skUpTime: dayjs().format('YYYY-MM-DD'),
        gunNo: ''
    }
    searchParams.value = { ...defaultSearchParams }
    pagination.value = {
        page: 1,
        pageSize: 10,
        itemCount: 0
    }
    loadData()
}
</script>
