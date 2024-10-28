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

        <table-action-modal v-model:visible="visible" :edit-data="editData" />
    </n-layout>
</template>
<script setup lang="tsx">
import { Ref, ref, provide } from 'vue'
import { useOilLedgerStore } from './store'
import { useBoolean, useList } from '@/hooks'
import { OilLedgerRequest, OilLedgerItem } from './types'
import { fetchOilLedgerExportList } from './service'
import {
    areaOptions,
    areaValue,
    loadAllAreaData,
    areaFn
} from '@/utils/common/areaUtils'
import { fetchFuelSiteList, fetchOilList } from '@/services'
import dayjs from 'dayjs'
// import { columns } from './columns'
import { useRoute } from 'vue-router'
import { exportDataToCSV } from '@/utils/common/exportUtils'
import { DataTableColumns, NSpace, SelectOption } from 'naive-ui'
import { ProTableColumns } from '@/components/ProTable/types'
import ClipboardText from '@/components/common/ClipboardText.vue'
import TableActionModal from './components/TableActionModal.vue'

type RowData = OilLedgerItem
const route = useRoute()
// const router = useRouter()
const columns: Ref<ProTableColumns<RowData>> = ref([
    {
        title: '#',
        key: 'index',
        width: 48,
        align: 'center',
        fixed: 'left',
        render(_, index) {
            return index + 1
        }
    },
    {
        title: '加油站名称',
        key: 'siteName',
        minWidth: 200,
        maxWidth: 240,
        fixed: 'left'
    },
    {
        title: '地区',
        key: 'areaName',
        minWidth: 120,
        maxWidth: 160
    },
    {
        title: '液位仪编号',
        key: 'deviceNum',
        align: 'center',
        render(row: RowData) {
            return (
                <NSpace justify="center">
                    <ClipboardText text={row.deviceNum as string} />
                </NSpace>
            )
        },
        minWidth: 140,
        maxWidth: 160
    },
    {
        title: '总进油量(L)',
        key: 'inputSum',
        minWidth: 120,
        maxWidth: 150
    },
    {
        title: '总出油量(L)',
        key: 'outputSum',
        minWidth: 120,
        maxWidth: 150
    },
    {
        title: '总销售(L)',
        key: 'saleSum',
        minWidth: 120,
        maxWidth: 150
    },
    {
        title: '时间',
        key: 'time',
        width: 200
    },
    {
        title: '操作',
        key: 'action',
        width: 120,
        align: 'center',
        fixed: 'right',
        render(row: RowData) {
            return (
                <n-button
                    type="primary"
                    tertiary
                    size="tiny"
                    onClick={() => {
                        handleDetail(row)
                    }}
                >
                    {{
                        icon: () => <icon-ant-design-file-text-outlined />,
                        default: () => '详情'
                    }}
                </n-button>
            )
        }
    }
]) as Ref<DataTableColumns<RowData>>

const { bool: visible, toggle: handleToggle } = useBoolean(false)
const editData = ref<any>(null)

/** 查看详情操作 */
function handleDetail(row: RowData) {
    handleToggle()

    editData.value = {
        ...row,
        range: row.time.split('~')
    }
    // router.push({
    //     path: '/oli_ledger_details',
    //     query: { deviceNum }
    // })
}

provide('oil_ledger_details_params', readonly(editData))

// 地区
loadAllAreaData()
const handleAreaChange = (value) => {
    areaFn(value, searchParams)
}
const range = ref<any>([Date.now(), Date.now()])

const pageTitle = computed(() => {
    return (route.meta.title as string) || '进出油台账'
})
const rowKey = (row: RowData) => row.id
const show = ref(false)
type SearchParams = Omit<OilLedgerRequest, 'pageNum' | 'pageSize'>

const searchParams = ref<SearchParams>({
    siteName: '',
    county: '',
    city: '',
    province: '',
    startTime: dayjs(range.value[0]).format('YYYY-MM-DD'),
    endTime: dayjs(range.value[1]).format('YYYY-MM-DD')
})
const store = useOilLedgerStore()
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
            fetchOilLedgerExportList,
            searchParams.value,
            '进出油台账.csv'
        )
    } catch (error) {
        console.error('Export failed:', error)
    } finally {
        show.value = false
    }
}
</script>
