<template>
    <n-layout class="bg-transparent">
        <n-card>
            <n-form
                label-placement="left"
                :show-feedback="false"
                :show-require-mark="false"
            >
                <n-grid x-gap="16" y-gap="16" :cols="3">
                    <n-form-item-gi label="油罐编号:">
                        <n-input
                            v-model:value="searchParams.tankNum"
                            type="text"
                            placeholder="请输入油罐编号"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="油品:">
                        <n-select
                            filterable
                            v-model:value="searchParams.oilName"
                            :options="oilOptions"
                            clearable
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="时间:">
                        <n-date-picker
                            v-model:formatted-value="searchParams.range"
                            type="daterange"
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
import { Ref, ref, computed, inject } from 'vue'
import type { SelectOption } from 'naive-ui'
import { useOilDetailStore } from './store'
import { useList } from '@/hooks'
import { OilLedgerRequest, OilLedgerItem } from '../types'
import { fetchOilList } from '@/services'
import { fetchDetailExportList } from '../service'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { columns } from './columns'
import { exportDataToCSV } from '@/utils/common/exportUtils'

const detailParams = inject<
    Ref<{ deviceNum: string; time?: string; [key: string]: any }>
>(
    'oil_ledger_details_params',
    ref({
        deviceNum: ''
    })
)

const { deviceNum, range } = detailParams.value

const show = ref(false)
const route = useRoute()
const pageTitle = computed(() => {
    return '数据列表'
})

// const range = ref<any>([Date.now(), Date.now()])

type RowData = OilLedgerItem
const rowKey = (row: RowData) => row.id

interface SearchParams {
    deviceNum?: string
    range: string[]
    oilName?: string
}

// const deviceNum = route.query.deviceNum || ''
const searchParams = ref<SearchParams>({
    deviceNum,
    // startTime: time && time.split('~')[0],
    // endTime: time && time.split('~')[1],
    range: range,
    oilName: ''
})
const store = useOilDetailStore()
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
// 获取油品列表数据
const oilOptions = ref<SelectOption[]>([])

const loadAllOilData = async () => {
    try {
        const { data, status } = await fetchOilList()
        if (status === 0) {
            const transformedData = data.map(
                (item: { name: string; id: number }) => ({
                    label: item.name,
                    value: item.name
                })
            )
            oilOptions.value = transformedData
        } else {
            oilOptions.value = []
            searchParams.value.oilName = ''
        }
    } catch (error) {
        throw new Error(error as string)
    }
}
loadAllOilData()
// 搜索
const handleSearch = () => {
    // searchParams.value.startTime = dayjs(range.value[0]).format('YYYY-MM-DD')
    // searchParams.value.endTime = dayjs(range.value[1]).format('YYYY-MM-DD')
    loadData()
}

// 重置
const handleReset = () => {
    range.value = [Date.now(), Date.now()]

    const defaultSearchParams = {
        deviceNum,
        range,
        oilName: ''
    }
    searchParams.value = { ...defaultSearchParams }
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
            fetchDetailExportList,
            searchParams.value,
            '进出油台账详情.csv'
        )
    } catch (error) {
        console.error('Export failed:', error)
    } finally {
        show.value = false
    }
}
</script>
