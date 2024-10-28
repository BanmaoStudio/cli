<template>
    <n-layout class="h-full">
        <n-card :bordered="true" class="shadow-sm">
            <n-form
                label-placement="left"
                label-width="auto"
                inline
                size="small"
                :show-feedback="false"
            >
                <n-grid
                    :x-gap="12"
                    :y-gap="8"
                    cols="1 s:2 m:3 l:4"
                    responsive="screen"
                >
                    <n-form-item-gi label="角色名称">
                        <n-input
                            v-model:value="searchParams.roleName"
                            clearable
                            placeholder="角色名称"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi suffix class="suffix flex justify-end">
                        <n-space>
                            <n-button @click="handleSearch">
                                <template #icon>
                                    <icon-ic-round-search />
                                </template>
                                查询
                            </n-button>
                        </n-space>
                    </n-form-item-gi>
                </n-grid>
            </n-form>
        </n-card>
        <!-- 数据表格 -->
        <n-card class="mt-12px shadow-sm" title="角色管理">
            <div mb-12px>
                <div class="flex-y-center justify-between">
                    <n-space>
                        <n-button
                            size="small"
                            type="info"
                            secondary
                            @click="handleAddTable"
                        >
                            <template #icon>
                                <icon-ant-design-plus-outlined />
                            </template>
                            添加
                        </n-button>
                    </n-space>
                    <n-space>
                        <n-button
                            size="small"
                            secondary
                            @click="() => loadData(1)"
                        >
                            <icon-mdi-refresh
                                class="mr-4px text-16px"
                                :class="{ 'animate-spin': loading }"
                            />
                            刷新表格
                        </n-button>
                        <column-setting v-model:columns="columns" secondary />
                    </n-space>
                </div>
            </div>
            <n-data-table
                remote
                :columns="columns"
                :data="dataSource"
                :loading="loading"
                :pagination="pagination"
                :row-key="rowKey"
                @update:page="handlePageChange"
                @update:page-size="handlePageSizeChange"
                :bordered="false"
                :max-height="506"
            />
        </n-card>
        <table-action-modal
            v-model:visible="visible"
            :type="modalType"
            :edit-data="editData"
        />
    </n-layout>
</template>

<script setup lang="tsx">
import { useRoleStore } from './store'
import { useBoolean, useList } from '@/hooks'
import { EnumResponseCode } from '@/enums'
import TableActionModal from './components/TableActionModal.vue'

defineOptions({ name: 'RolePage' })

const store = useRoleStore()

const rowKey = (row: any) => row.id as unknown as string

const message = useMessage()

const searchParams = ref({
    roleName: ''
})

/** 获取列表数据 */
const {
    dataSource,
    loading,
    pagination,
    // handleExcelData,
    handlePageChange,
    handlePageSizeChange,
    loadData
} = useList<any>(store.getDataList, {
    filterOption: searchParams
})

const columns: any = [
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
    { title: '角色名称', key: 'roleName' },
    {
        title: '角色状态',
        key: 'status',
        render(row: any) {
            return (
                <n-switch
                    value={row.status}
                    disabled
                    checked-value={'0'}
                    unchecked-value={'1'}
                />
            )
        }
    },
    { title: '角色描述', key: 'remark' },
    {
        title: '操作',
        key: 'action',
        width: 200,
        fixed: 'right',
        align: 'center',
        render(row: any) {
            return (
                <n-space justify="center">
                    <n-button
                        type="primary"
                        tertiary
                        size="tiny"
                        onClick={() => handleEditTable(row)}
                        v-slots={{
                            icon: () => <icon-ant-design-edit-outlined />
                        }}
                    >
                        修改
                    </n-button>
                    {/* <n-button
                        type="error"
                        tertiary
                        size="tiny"
                        onClick={() => handleDelete(row.roleId as number)}
                        v-slots={{
                            icon: () => <icon-ant-design-delete-outlined />
                        }}
                    >
                        删除
                    </n-button> */}
                    <n-popconfirm
                        onPositiveClick={() => handleDelete(row.roleId)}
                    >
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
                            default: () => '确定要删除该角色吗？'
                        }}
                    </n-popconfirm>
                </n-space>
            )
        }
    }
]

type ModalType = 'add' | 'edit'

const { bool: visible, setTrue: openModal } = useBoolean()

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
    modalType.value = type
}

const editData = ref<any>(null)
const handleSearch = () => {
    loadData(1)
}
/** 添加操作 */
const handleAddTable = () => {
    openModal()
    setModalType('add')
}

/** 修改操作 */
const handleEditTable = (row: any) => {
    editData.value = row
    setModalType('edit')
    openModal()
}

const handleDelete = async (rowId: number | null) => {
    if (!rowId) throw new Error('参数 RowId 的数据类型应该为数字')
    const result = await store.getDeleteRole(rowId)

    if (result && result.status === EnumResponseCode.SUCCESS) {
        message.success(result.data || '删除成功')
        loadData(1)
    }
}
watch(visible, (newValue) => {
    if (!newValue) {
        loadData(1)
    }
})
</script>
