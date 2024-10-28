<template>
    <n-layout class="bg-transparent">
        <n-card>
            <n-form
                label-placement="left"
                :show-feedback="false"
                :show-require-mark="false"
            >
                <n-grid x-gap="30" :cols="3" :y-gap="15">
                    <n-form-item-gi label="加油站名称:">
                        <n-select
                            filterable
                            v-model:value="searchParams.siteName"
                            :options="siteOptions"
                            clearable
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="油罐编号:">
                        <n-input
                            v-model.number="searchParams.tankNum"
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
                        <n-date-picker
                            v-model:value="range"
                            type="daterange"
                            clearable
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
import { Ref, ref } from 'vue'
import { useOilInletStore } from './store'
import { useList } from '@/hooks'
import { OilInletRequest, OilInletItem } from './types'
import { fetchInRecordExportList } from './service'
import {
    areaOptions,
    areaValue,
    loadAllAreaData,
    areaFn
} from '@/utils/common/areaUtils'
import { fetchFuelSiteList, fetchOilList } from '@/services'
import dayjs from 'dayjs'
import { columns } from './columns'
import { useRoute } from 'vue-router'
import { exportDataToCSV } from '@/utils/common/exportUtils'
import { SelectOption } from 'naive-ui'

type RowData = OilInletItem
// 地区
loadAllAreaData()
const handleAreaChange = (value) => {
    areaFn(value, searchParams)
}
const range = ref<any>(null)
const route = useRoute()
const pageTitle = computed(() => {
    return (route.meta.title as string) || '进油记录'
})
const rowKey = (row: RowData) => row.id
const show = ref(false)
type SearchParams = Omit<OilInletRequest, 'pageNum' | 'pageSize'>

const searchParams = ref<SearchParams>({
    siteName: '',
    tankNum: null,
    oilName: '',
    county: '',
    city: '',
    province: '',
    startTime: '',
    endTime: ''
})
const store = useOilInletStore()
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
const siteOptions: Ref<SelectOption[]> = ref([])

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
// 获取加油站列表数据

const oilOptions: Ref<SelectOption[]> = ref([])

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
    if (range.value && range.value.length > 0) {
        searchParams.value.startTime =
            dayjs(range.value[0]).format('YYYY-MM-DD') + ' 00:00:00'
        searchParams.value.endTime =
            dayjs(range.value[1]).format('YYYY-MM-DD') + ' 23:59:59'
    } else {
        searchParams.value.startTime = ''
        searchParams.value.endTime = ''
    }

    if (!areaValue.value) {
        searchParams.value.county = ''
        searchParams.value.city = ''
        searchParams.value.province = ''
    }
    loadData()
}

// 重置
const handleReset = () => {
    range.value = null
    const defaultSearchParams = {
        startTime: '',
        endTime: '',
        siteName: '',
        tankNum: null,
        oilName: '',
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
            fetchInRecordExportList,
            searchParams.value,
            '进油记录.csv'
        )
    } catch (error) {
        console.error('Export failed:', error)
    } finally {
        show.value = false
    }
}
</script>
