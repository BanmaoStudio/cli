<template>
    <n-layout class="h-full">
        <n-card class="shadow-sm" title="菜单管理">
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
                            @click="() => loadData()"
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
                :row-key="rowKey"
                :bordered="false"
                :max-height="506"
                default-expand-all
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
import { useMenuStore } from './store'
import { useBoolean } from '@/hooks'
import { Icon } from '@iconify/vue'
import { EnumResponseCode } from '@/enums'
import TableActionModal from './components/TableActionModal.vue'
import { DataTableColumn } from 'naive-ui'

defineOptions({ name: 'MenuPage' })

const store = useMenuStore()

const rowKey = (row: any) => row.id as unknown as string

const message = useMessage()
const loading = ref(false)
const dataSource = ref([])

/** 获取列表数据 */
async function loadData() {
    const res = await store.getDataList()
    if (res) {
        dataSource.value = res.data
        return
    }
    dataSource.value = []
}

onMounted(() => {
    loadData()
})

const columns = ref<DataTableColumn[]>([
    {
        title: 'ID',
        key: 'id',
        align: 'center',
        fixed: 'left'
    },
    {
        title: '菜单名称',
        key: 'label',
        fixed: 'left',
        render(row: any) {
            return row.name
        }
    },
    {
        title: '路由 Name',
        key: 'name',
        render(row: any) {
            return row.nameEn
        }
    },
    {
        title: '路由 Path',
        key: 'path',
        render(row: any) {
            return row.url
        }
    },
    {
        title: '开启状态',
        key: 'status',

        render(row: any) {
            return (
                <n-switch
                    v-model:value={row.status}
                    checked-value={0}
                    unchecked-value={1}
                    onUpdate:value={() => handleChangeStatus(row)}
                />
            )
        }
    },
    {
        title: '图标',
        key: 'icon',
        render(row: any) {
            return <Icon icon={row.icon} class="text-18px font-bold" />
        }
    },
    { title: '排序标记', key: 'weight' },
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
                            default: () => '确定要删除该菜单吗？'
                        }}
                    </n-popconfirm>
                </n-space>
            )
        }
    }
])

type ModalType = 'add' | 'edit'

const { bool: visible, setTrue: openModal } = useBoolean()

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
    modalType.value = type
}

const editData = ref<any>(null)
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

/** 修改状态 */
const handleChangeStatus = async (row: any) => {
    if (!row) throw new Error('参数 RowId 的数据类型应该为数字')
    const result = await store.getEditMenu(row)

    if (result && result.status === EnumResponseCode.SUCCESS) {
        message.success('修改成功')
        loadData()
    }
}

const handleDelete = async (id: number | null) => {
    if (!id) throw new Error('参数 RowId 的数据类型应该为数字')
    const result = await store.getDeleteMenu(id)

    if (result && result.status === EnumResponseCode.SUCCESS) {
        message.success('删除成功')
        loadData()
    }
}
watch(visible, (newValue) => {
    if (!newValue) {
        loadData()
    }
})
</script>
