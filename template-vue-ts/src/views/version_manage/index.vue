<template>
    <n-layout class="bg-transparent">
        <pro-table
            :page-title="pageTitle"
            :columns="columns"
            :loading="loading"
            :data-source="dataSource"
            :pagination="pagination"
            :row-key="rowKey"
            @load-data="loadData"
            createButton
            @create-method="handleCreate"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            @update:checked="handleCheck"
            :scroll-x="1600"
        />
        <table-action-modal
            v-model:visible="visible"
            :type="modalType"
            :edit-data="editData"
        />
    </n-layout>
</template>

<script setup lang="tsx">
import { Ref, computed, ref, watch } from 'vue'
import { DataTableColumns, DataTableRowKey, useMessage } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useCommonStore } from '@/store'
import { useVersionManageStore } from './store'
import { useBoolean, useList } from '@/hooks'
import { useToggle } from '@vueuse/core'
import TableActionModal from './components/TableActionModal.vue'
import ClipboardText from '@/components/common/ClipboardText.vue'

import type { VersionListItem, VersionListRequest } from './types'
import { EnumResponseCode } from '@/enums'

defineOptions({ name: 'VersionManagePage' })

type RowData = VersionListItem

type SearchParams = Omit<VersionListRequest, 'pageNum' | 'pageSize'>

const message = useMessage()
const store = useVersionManageStore()
const route = useRoute()

const pageTitle = computed(() => {
    return (route.meta.title as string) || '固件包版本管理'
})

const rowKey = (row: RowData) => row.id

const searchParams = ref<SearchParams>({})

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
    { type: 'selection', fixed: 'left' },
    {
        title: '#',
        key: 'index',
        align: 'center',
        fixed: 'left',
        width: 60,
        render(row, index) {
            // return index + 1
            return row.id
        }
    },
    {
        title: '固件类型',
        key: 'type',
        render(row: RowData) {
            return <span>{row.type === '0' ? 'MCU' : '4G'}</span>
        }
    },
    {
        title: '固件版本号',
        key: 'version'
    },
    {
        title: '固件包地址',
        key: 'url',
        align: 'center'
    },
    {
        title: '状态',
        key: 'status',
        width: 120,
        align: 'center',
        render(row: RowData) {
            return (
                <n-switch
                    value={row.status}
                    checked-value="0"
                    unchecked-value="1"
                    on-update:value={(value) => {
                        row.status = value
                    }}
                >
                    {{
                        checked: () => <span>启用</span>,
                        unchecked: () => <span>禁用</span>
                    }}
                </n-switch>
            )
        }
    },
    {
        title: '备注',
        key: 'remark',
        align: 'center'
    },
    {
        title: '创建时间',
        key: 'createTime',
        align: 'center'
    },
    {
        title: '更新时间',
        key: 'updateTime',
        align: 'center'
    },
    {
        title: '操作',
        key: 'actions',
        width: 240,
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
                    <n-popconfirm onPositiveClick={() => handleDelete(row.id)}>
                        {{
                            trigger: () => (
                                <n-button type="error" tertiary size="tiny">
                                    {{
                                        icon: () => (
                                            <icon-ant-design-delete-outlined />
                                        ),
                                        default: () => '删除'
                                    }}
                                </n-button>
                            ),
                            default: () => '确定要删除该固件包版本吗？'
                        }}
                    </n-popconfirm>
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
    if (v.length > 0) {
        checkedCollapsed.value = true
    } else {
        checkedCollapsed.value = false
    }
})

/** ================== 操作 ================= */
type ModalType = 'add' | 'edit'

const { bool: visible, setTrue: openModal } = useBoolean()

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
    modalType.value = type
}

const editData = ref<RowData | null>(null)
function setEditData(data: RowData | null) {
    editData.value = data
}

/** 添加操作 */
const handleCreate = () => {
    openModal()
    setModalType('add')
}

/** 修改操作 */
const handleEdit = (row: RowData) => {
    setEditData(row)

    setModalType('edit')
    openModal()
}

const handleDelete = async (rowId: number | null) => {
    if (!rowId) throw new Error('参数 RowId 的数据类型应该为数字')
    const result = await store.deleteData(rowId)

    if (result.status === EnumResponseCode.SUCCESS) {
        message.success(result.msg || '删除成功')
        loadData(1)
    }
}

// 注册加油机
const handleSubmit = (data: any) => {
    console.log(data)
}
</script>
