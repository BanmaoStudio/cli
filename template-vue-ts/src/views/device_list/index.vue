<template>
    <n-layout class="bg-transparent">
        <n-card>
            <n-form
                label-placement="left"
                :show-feedback="false"
                :show-require-mark="false"
            >
                <n-grid x-gap="30" :cols="4">
                    <n-gi>
                        <n-form-item-gi label="加油站名称:">
                            <n-select
                                filterable
                                v-model:value="searchParams.siteId"
                                :options="siteOptions"
                                clearable
                            />
                        </n-form-item-gi>
                    </n-gi>
                    <n-gi>
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
                    </n-gi>
                    <n-gi>
                        <n-form-item-gi label="注册状态:">
                            <n-select
                                v-model:value="searchParams.onlineStatus"
                                :options="statusOptions"
                            />
                        </n-form-item-gi>
                    </n-gi>
                    <n-gi>
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
            @update:checked="handleCheck"
        />
    </n-layout>
</template>

<script setup lang="tsx">
import { Ref, computed, ref, watch } from 'vue'
import { DataTableRowKey, SelectOption } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useStationStore } from './store'
import { useList } from '@/hooks'
import { RegisterDeviceItem, RegisterDeviceListRequest } from './types'
import { fetchFuelStationList } from '@/services'
import { fetchExportDevice } from './service'
import { exportDataToCSV } from '@/utils/common/exportUtils'
import {
    areaOptions,
    areaValue,
    loadAllAreaData,
    areaFn
} from '@/utils/common/areaUtils'
import { createColumns } from './columns'

const handleUpdateList = () => {
    console.log('触发更新列表事件')
    loadData() // 调用刷新数据的逻辑
}

const columns = createColumns(handleUpdateList)
// 地区
loadAllAreaData()
const handleAreaChange = (value) => {
    areaFn(value, searchParams)
}

// import { EnumResponseCode } from '@/enums'
const show = ref(false)

defineOptions({ name: 'StationPage' })

type RowData = RegisterDeviceItem

type SearchParams = Omit<RegisterDeviceListRequest, 'pageNum' | 'pageSize'>

const store = useStationStore()
const route = useRoute()

const pageTitle = computed(() => {
    return (route.meta.title as string) || '加油机管理'
})
const statusOptions = ref([
    {
        label: '在线',
        value: '1'
    },
    {
        label: '离线',
        value: '2'
    },
    {
        label: '全部',
        value: ''
    }
])
const rowKey = (row: RowData) => row.id

const searchParams = ref<SearchParams>({
    siteId: '',
    onlineStatus: '',
    county: '',
    city: '',
    province: ''
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
    filterOption: searchParams
})

/** 多选操作 */
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const checkedCollapsed = ref(false)

const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeysRef.value = rowKeys
}

watch(checkedRowKeysRef, (v, _ov) => {
    if (v.length > 0) {
        checkedCollapsed.value = true
    } else {
        checkedCollapsed.value = false
    }
})

const siteOptions: Ref<SelectOption[]> = ref([])

// 获取加油站列表数据
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
        } else {
            siteOptions.value = []
            searchParams.value.siteId = ''
        }
    } catch (error) {
        throw new Error(error as string)
    }
}
loadAllStationData()

/** ================== 升级操作 ================= */

const handleSearch = () => {
    if (!areaValue.value) {
        searchParams.value.county = ''
        searchParams.value.city = ''
        searchParams.value.province = ''
    }
    loadData()
}
const handleReset = () => {
    const defaultSearchParams = {
        siteId: '',
        onlineStatus: '',
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
            fetchExportDevice,
            searchParams.value,
            '设备列表.csv'
        )
    } catch (error) {
        console.error('Export failed:', error)
    } finally {
        show.value = false
    }
}
</script>
