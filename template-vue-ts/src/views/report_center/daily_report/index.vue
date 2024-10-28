<template>
    <n-layout class="bg-transparent">
        <n-card>
            <n-form
                label-placement="left"
                :show-feedback="false"
                :show-require-mark="false"
            >
                <n-grid x-gap="30" :cols="4">
                    <n-form-item-gi label="加油站名称:">
                        <n-select
                            filterable
                            v-model:value="searchParams.siteName"
                            :options="siteOptions"
                            clearable
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="地区:">
                        <n-cascader
                            v-model:value="areaValue"
                            :options="areaOptions"
                            check-strategy="all"
                            size="medium"
                            @update:value="handleAreaChange"
                            clearable
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="时间:">
                        <n-date-picker v-model:value="range" type="daterange" />
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
                            <n-spin :show="show" size="small">
                                <n-button
                                    strong
                                    secondary
                                    type="info"
                                    @click="handleExport"
                                    >导出</n-button
                                >
                            </n-spin>
                        </n-space>
                    </n-gi>
                </n-grid>
            </n-form>
        </n-card>
        <n-card
            style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 5px"
        >
            <n-descriptions
                label-placement="top"
                label-align="center"
                :column="5"
                :label-style="{ color: 'rgb(140, 140, 140)' }"
                :content-style="{
                    textAlign: 'center',
                    fontSize: '22px',
                    color: 'rgb(0, 0, 0)'
                }"
            >
                <n-descriptions-item label="总销售金额">
                    {{
                        dailyTotal.saleAmount?.toLocaleString('zh-CN', {
                            style: 'currency',
                            currency: 'CNY'
                        })
                    }}
                </n-descriptions-item>
                <n-descriptions-item label="总出油量">
                    {{ dailyTotal.outputSum?.toLocaleString() }}L
                </n-descriptions-item>
                <n-descriptions-item label="总出油金额">
                    {{
                        dailyTotal.outputAmount?.toLocaleString('zh-CN', {
                            style: 'currency',
                            currency: 'CNY'
                        })
                    }}
                </n-descriptions-item>
                <n-descriptions-item label="总销售量">
                    {{ dailyTotal.saleSum?.toLocaleString() }}L
                </n-descriptions-item>
                <n-descriptions-item label="总进油量">
                    {{ dailyTotal.inputSum?.toLocaleString() }}L
                </n-descriptions-item>
            </n-descriptions>
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
import { Ref, ref } from 'vue'
import { useDailyReportStore } from './store'
import { useList } from '@/hooks'
import { DailyReportRequest, DailyReportItem } from './types'
import { fetchDailyReportExportList } from './service'
import {
    areaOptions,
    areaValue,
    loadAllAreaData,
    areaFn
} from '@/utils/common/areaUtils'
import { fetchFuelSiteList } from '@/services'
import dayjs from 'dayjs'
import { columns } from './columns'
import { useRoute } from 'vue-router'
import { exportDataToCSV } from '@/utils/common/exportUtils'
import { SelectOption } from 'naive-ui'

type RowData = DailyReportItem
const route = useRoute()

// 地区
loadAllAreaData()
const handleAreaChange = (value) => {
    areaFn(value, searchParams)
}
const range = ref<any>([Date.now(), Date.now()])

const pageTitle = computed(() => {
    return (route.meta.title as string) || '日度报表中心'
})
const rowKey = (row: RowData) => row.id
const show = ref(false)
type SearchParams = Omit<DailyReportRequest, 'pageNum' | 'pageSize'>

const searchParams = ref<SearchParams>({
    siteName: '',
    county: '',
    city: '',
    province: '',
    startTime: dayjs(range.value[0]).format('YYYY-MM-DD'),
    endTime: dayjs(range.value[1]).format('YYYY-MM-DD')
})
const store = useDailyReportStore()
interface DailyTotal {
    saleAmount: number
    outputSum: number
    outputAmount: number
    saleSum: number
    inputSum: number
}
const dailyTotal = ref<DailyTotal>({
    saleAmount: 0,
    outputSum: 0,
    outputAmount: 0,
    saleSum: 0,
    inputSum: 0
})
/** 获取列表数据 */
const {
    dataSource,
    loading,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    loadData
} = useList<any>(store.getDataList, {
    filterOption: searchParams,
    callback: (data) => {
        dailyTotal.value = data.total
        return data.list
    }
})

// 获取加油站列表数据
const siteOptions = ref<SelectOption[]>([])

const loadAllStationData = async () => {
    try {
        const { data, status } = await fetchFuelSiteList()
        if (status === 0) {
            const transformedData = data.map(
                (item: { name: string; id: number }) => ({
                    label: item.name,
                    value: item.name
                })
            )
            siteOptions.value = transformedData
        } else {
            siteOptions.value = []
            searchParams.value.siteName = ''
        }
    } catch (error) {
        throw new Error(error as string)
    }
}
loadAllStationData()

// 搜索
const handleSearch = () => {
    searchParams.value.startTime = dayjs(range.value[0]).format('YYYY-MM-DD')
    searchParams.value.endTime = dayjs(range.value[1]).format('YYYY-MM-DD')
    if (!areaValue.value) {
        searchParams.value.county = ''
        searchParams.value.city = ''
        searchParams.value.province = ''
    }
    loadData()
}

// 重置
const handleReset = () => {
    range.value = [Date.now(), Date.now()]
    const defaultSearchParams = {
        startTime: '',
        endTime: '',
        siteName: '',
        county: '',
        city: '',
        province: ''
    }
    searchParams.value = { ...defaultSearchParams }
    areaValue.value = ''
    pagination.value = {
        page: 1,
        pageSize: 10,
        itemCount: 0
    }
    loadData()
}
// 导出
const handleExport = async () => {
    show.value = true
    try {
        await exportDataToCSV(
            fetchDailyReportExportList,
            searchParams.value,
            '日度报表.csv'
        )
    } catch (error) {
        console.error('Export failed:', error)
    } finally {
        show.value = false
    }
}
</script>
