<template>
    <n-layout class="bg-transparent">
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
                    :collapsed="gridCollapsed"
                    :collapsed-rows="2"
                    responsive="screen"
                >
                    <!-- <n-form-item-gi label="所属地区">
            <area-code-field v-model:value="searchParams.areaCode" />
          </n-form-item-gi> -->
                    <n-form-item-gi label="用户名">
                        <n-input
                            v-model:value="searchParams.name"
                            clearable
                            placeholder="用户名"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="账号名称">
                        <n-input
                            v-model:value="searchParams.username"
                            clearable
                            placeholder="账号名称"
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
                            <!-- <n-button @click="handleExcelData">
                <template #icon>
                  <icon-carbon-export  />
                </template>
                导出
              </n-button> -->
                            <n-button
                                v-if="false"
                                @click="() => toggleGridCollapsed()"
                            >
                                <template #icon>
                                    <icon-ic-round-expand-more
                                        v-if="gridCollapsed"
                                    />
                                    <icon-ic-round-expand-less v-else />
                                </template>
                                {{ gridCollapsed === false ? '折叠' : '展开' }}
                            </n-button>
                        </n-space>
                    </n-form-item-gi>
                </n-grid>
            </n-form>
        </n-card>
        <!-- 数据表格 -->
        <n-card class="mt-12px shadow-sm" :title="pageTitle">
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
                        <n-button
                            v-show="false"
                            size="small"
                            type="error"
                            secondary
                        >
                            <template #icon>
                                <icon-ant-design:delete-outlined />
                            </template>
                            删除
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
                @update:checked-row-keys="handleCheck"
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
        <password-modal v-model:passVisible="passVisible" :id="passwordId" />
    </n-layout>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { DataTableColumns, DataTableRowKey, useMessage } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useCommonStore } from '@/store'
import { useAccountStore } from './store'
import { useBoolean, useList } from '@/hooks'
import type { AccountRequest, Account, AccountForm } from './types'
import { useToggle } from '@vueuse/core'
// import { columns } from './column'
// import ClipboardText from '@/components/common/ClipboardText.vue'
import TableActionModal from './components/TableActionModal.vue'
import PasswordModal from './components/PasswordModal.vue'
import { EnumResponseCode } from '@/enums'

defineOptions({ name: 'StationPage' })

type RowData = Account

type SearchParams = Omit<AccountRequest, 'page' | 'pageSize'>

const message = useMessage()
const store = useAccountStore()
const commonStore = useCommonStore()
const route = useRoute()
const passwordId = ref(null)
const pageTitle = computed(() => {
    return (route.meta.title as string) || '账号管理'
})

const rowKey = (row: RowData) => row.id as unknown as string

const searchParams = ref<SearchParams>({})

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
    // exportRequestFn: stationStore.exportDataList
})

const columns: Ref<DataTableColumns<Account>> = ref([
    // { type: 'selection' },
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
    { title: '用户名', key: 'name', width: 100 },
    { title: '登录账号', key: 'username', width: 160 },
    {
        title: '角色',
        key: 'roleNames',
        width: 240,
        render(row: Account) {
            return (
                <>
                    {row.roleNames.map((role: string, index: number) => (
                        <n-tag
                            key={index}
                            type="info"
                            size="small"
                            class="mr-5px"
                        >
                            {role}
                        </n-tag>
                    ))}
                </>
            )
        }
    },

    {
        title: '账号状态',
        key: 'status',
        width: 100,
        render(row: Account) {
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
    { title: '创建时间', key: 'createTime', width: 200, align: 'center' },
    {
        title: '操作',
        key: 'actions',
        width: 250,
        align: 'center',
        fixed: 'right',
        render(row: Account) {
            return (
                <n-space justify="center">
                    <n-button
                        type="primary"
                        tertiary
                        size="tiny"
                        onClick={() => handleResetPass(row.id as number)}
                        v-slots={{
                            icon: () => <icon-ant-design-rotate-left-outlined />
                        }}
                    >
                        重置密码
                    </n-button>
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
                        onClick={() => handleDelete(row.id as number)}
                        v-slots={{
                            icon: () => <icon-ant-design-delete-outlined />
                        }}
                    >
                        删除
                    </n-button> */}
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
                            default: () => '确定要删除该账号吗？'
                        }}
                    </n-popconfirm>
                </n-space>
            )
        }
    }
]) as Ref<DataTableColumns<Account>>

/** 数据查询操作 */
// 默认为折叠
const [gridCollapsed, toggleGridCollapsed] = useToggle(true)

const handleSearch = () => {
    loadData(1)
}

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
const { bool: passVisible, setTrue: openPassModal } = useBoolean()

const modalType = ref<ModalType>('add')

function setModalType(type: ModalType) {
    modalType.value = type
}

const editData = ref<AccountForm | null>(null)
function setEditData(data: RowData | null) {
    const { id, username, name, status, roleIds, lat, lng } = data as RowData
    editData.value = {
        id,
        username,
        name,
        status,
        roleIds,
        lat,
        lng
    }
}

/** 添加操作 */
const handleAddTable = () => {
    openModal()
    setModalType('add')
}

/** 修改操作 */
const handleEditTable = (row: RowData) => {
    setEditData(row)
    setModalType('edit')
    openModal()
}
/** 重置操作 */
const handleResetPass = async (rowId: any) => {
    openPassModal()
    passwordId.value = rowId
}

const handleDelete = async (rowId: number | null) => {
    if (!rowId) throw new Error('参数 RowId 的数据类型应该为数字')
    const result = await store.deleteData(rowId)

    if (result && result.status === EnumResponseCode.SUCCESS) {
        message.success(result.msg || '删除成功')
        loadData(1)
    }
}

watch(visible, (newValue) => {
    if (!newValue) {
        loadData(1)
    }
})
</script>
