<template>
    <n-layout class="bg-transparent">
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
            createButton
            @create-method="handleCreate"
            @update:checked="handleCheck"
            :scroll-x="1200"
        />
        <TableActionModal
            v-model:visible="modalVisible"
            :type="modalType"
            :editData="editData"
            @update-list="updateList"
        />
    </n-layout>
</template>

<script setup lang="tsx">
import { Ref, computed, ref, watch } from 'vue'
import { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useFuelStationStore } from './store'
import { useBoolean, useList } from '@/hooks'
import { useToggle, useWindowSize } from '@vueuse/core'

import ClipboardText from '@/components/common/ClipboardText.vue'
import TableActionModal from './components/TableActionModal.vue'

import { FuelStationItem, FuelStationParams } from './types'
import { ProTableColumns } from '@/components/ProTable/types'

defineOptions({ name: 'FuelStationPage' })

type RowData = FuelStationItem

type SearchParams = Omit<FuelStationParams, 'pageNum' | 'pageSize'>

// const message = useMessage();
const store = useFuelStationStore()
const route = useRoute()

const pageTitle = computed(() => {
    return (route.meta.title as string) || '加油站管理'
})

const rowKey = (row: RowData) => row.id

const searchParams = ref<SearchParams>({
    name: ''
})

const { height } = useWindowSize()
const tableHeight = ref(height.value - 340)

watch(
    () => height.value,
    (newVal) => {
        tableHeight.value = newVal - 340
    }
)

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
    // exportRequestFn: store.exportDataList
})

const columns: Ref<DataTableColumns<RowData>> = ref([
    {
        title: '#',
        key: 'index',
        width: 60,
        align: 'center',
        fixed: 'left',
        render(_row, index) {
            return index + 1
        }
    },
    {
        title: '加油站名称',
        key: 'name',
        fixed: 'left',
        minWidth: 250,
        ellipsis: { tooltip: true }
    },
    {
        title: '社会信用代码',
        key: 'creditCode',
        render(row: RowData) {
            return <ClipboardText text={row.creditCode} />
        },
        minWidth: 200
    },
    {
        title: '联系人',
        key: 'legal',
        align: 'center',
        minWidth: 120
    },
    {
        title: '联系电话',
        key: 'telephone',
        align: 'center',
        width: 140
    },
    {
        title: '加油机数量',
        key: 'machineNum',
        align: 'center',
        minWidth: 120
    },
    {
        title: '油罐数量',
        key: 'tankNum',
        align: 'center',
        minWidth: 120
    },
    {
        title: '经营状态',
        key: 'state',
        minWidth: 120,
        render(row: RowData) {
            return (
                <n-tag
                    type={row.state === 1 ? 'primary' : 'default'}
                    size="small"
                >
                    {row.state === 1 ? '营业中' : '未营业'}
                </n-tag>
            )
        }
    },
    {
        title: '操作',
        key: 'actions',
        width: 200,
        align: 'center',
        fixed: 'right',
        render(row: RowData) {
            return (
                <n-space justify="center" wrap={false}>
                    <n-button
                        type="primary"
                        tertiary
                        size="tiny"
                        onClick={() => {
                            handleEdit(row)
                        }}
                    >
                        {{
                            icon: () => <icon-ant-design-edit-outlined />,
                            default: () => '编辑'
                        }}
                    </n-button>
                    <n-button
                        type="error"
                        tertiary
                        size="tiny"
                        onClick={() => {
                            handleDeleteById(row.id)
                        }}
                    >
                        {{
                            icon: () => <icon-ant-design-delete-outlined />,
                            default: () => '删除'
                        }}
                    </n-button>
                </n-space>
            )
        }
    }
]) as Ref<DataTableColumns<RowData>>

/** 多选操作 */
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const checkedCollapsed = ref(false)

const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeysRef.value = rowKeys
}

watch(checkedRowKeysRef, (v, _ov) => {
    checkedCollapsed.value = v.length > 0
})

const { bool: modalVisible, setTrue: openModal } = useBoolean()
const modalType = ref<'add' | 'edit' | undefined>('edit')
const editData = ref({})

const handleCreate = () => {
    modalType.value = 'add'
    openModal()
}

const handleEdit = (row: RowData) => {
    openModal()
    modalType.value = 'edit'
    editData.value = row
}
// 删除接口
const handleDeleteById = async (id: number) => {
    await store.deleteData(id)
    await loadData()
}
// 更新列表
const updateList = () => {
    loadData()
}
</script>
