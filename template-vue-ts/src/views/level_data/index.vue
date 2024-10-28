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
                    <n-form-item-gi label="油罐编号:">
                        <n-input
                            v-model.number:value="searchParams.tankNum"
                            type="text"
                            placeholder="请输入油罐编号"
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
            :pageTitle="pageTitle"
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
import { DataTableColumns, SelectOption } from 'naive-ui'
import { useBoolean, useList } from '@/hooks'
import { useRoute, useRouter } from 'vue-router'
import { useLevelStore } from './store'
import { LevelDataRequest, LevelDataItem } from './types'
import { ProTableColumns } from '@/components/ProTable/types'
import { fetchFuelSiteList } from '@/services'
import ClipboardText from '@/components/common/ClipboardText.vue'
import TableActionModal from './components/TableActionModal.vue'

import {
    areaOptions,
    areaValue,
    loadAllAreaData,
    areaFn
} from '@/utils/common/areaUtils'

const route = useRoute()
const rowKey = (row: RowData) => row.id
// 地区
loadAllAreaData()
const handleAreaChange = (value) => {
    areaFn(value, searchParams)
}
const pageTitle = computed(() => {
    return (route.meta.title as string) || '液位数据'
})
const router = useRouter()

const { bool: visible, toggle: handleToggle } = useBoolean(false)
// const { bool: visible, setTrue: handleToggle } = useBoolean()
const editData = ref<any | null>(null)

function handleDetail(row: RowData) {
    handleToggle()

    editData.value = {
        ...row
    }

    // router.push({
    //     path: '/history_details',
    //     query: { deviceNum, tankNum }
    // })
}
provide('detailParams', readonly(editData))

type RowData = LevelDataItem
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
        titleAlign: 'center',
        ellipsis: {
            tooltip: true
        },
        fixed: 'left'
    },
    {
        title: '地区',
        key: 'areaName',
        titleAlign: 'center',
        ellipsis: {
            tooltip: true
        },
        minWidth: 160
    },
    {
        title: '液位仪编号',
        key: 'deviceNum',
        minWidth: 160,
        align: 'center',
        ellipsis: {
            tooltip: true
        },
        render(row: RowData) {
            return <ClipboardText text={row.deviceNum as string} />
        }
    },
    {
        title: '油罐编号',
        key: 'tankNum',
        align: 'center',
        minWidth: 120
    },
    {
        title: '油品',
        key: 'oilName',
        align: 'center',
        minWidth: 120,
        render(row: RowData) {
            return (
                <n-space justify="center">
                    <n-tag size="small" type="info">
                        {row.oilName}
                    </n-tag>
                </n-space>
            )
        }
    },
    {
        title: '当前油高(mm)',
        key: 'oilHeight',
        align: 'center',
        minWidth: 140
    },
    {
        title: '当前余量(L)',
        key: 'oilAllowance',
        align: 'center',
        minWidth: 140
    },
    {
        title: '操作',
        key: 'actions',
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
                        default: () => '历史详情'
                    }}
                </n-button>
            )
        }
    }
]) as Ref<DataTableColumns<RowData>>

type SearchParams = Omit<LevelDataRequest, 'pageNum' | 'pageSize'>
const searchParams = ref<SearchParams>({
    siteName: '',
    tankNum: null,
    county: '',
    city: '',
    province: ''
})

const store = useLevelStore()
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

// 搜索
const handleSearch = () => {
    if (!areaValue.value) {
        searchParams.value.county = ''
        searchParams.value.city = ''
        searchParams.value.province = ''
    }
    loadData()
}
// 重置
const handleReset = () => {
    const defaultSearchParams = {
        siteName: '',
        tankNum: null,
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
</script>
