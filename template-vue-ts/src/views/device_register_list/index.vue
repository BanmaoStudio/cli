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
                                v-model:value="searchParams.status"
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
            @create-method="handleCreate"
            createButtonText="注册加油机"
            createButton
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            :pagination="pagination"
            :scroll-x="1600"
        />
        <!-- 注册加油机 -->
        <n-modal
            v-model:show="registerDeviceVisible"
            preset="card"
            title="注册加油机"
            class="w-1000px h-800px"
        >
            <machine-form
                @save="handleSubmit"
                @close="handleClose"
                :machine-data="machineData"
            />
        </n-modal>
        <table-action-model
            v-model:visible="visible"
            type="view"
            :edit-data="editData"
        />
    </n-layout>
</template>

<script setup lang="tsx">
import { Ref, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceRegisterListStore } from './store'
import { useBoolean, useList } from '@/hooks'
import { useWindowSize } from '@vueuse/core'
import TableActionModel from './components/TableActionModal.vue'
import ClipboardText from '@/components/common/ClipboardText.vue'

import MachineForm from '../register/components/MachineForm.vue'
import {
    areaOptions,
    areaValue,
    loadAllAreaData,
    areaFn
} from '@/utils/common/areaUtils'
import type { DataTableColumns, DataTableRowKey, SelectOption } from 'naive-ui'
import type { DeviceRegisterItem, DeviceRegisterRequest } from './types'
import { fetchFuelStationList, fetchAllAreaCode } from '@/services'

defineOptions({ name: 'DeviceRegisterListPage' })

// 地区
loadAllAreaData()
const handleAreaChange = (value) => {
    areaFn(value, searchParams)
}

type RowData = DeviceRegisterItem

type SearchParams = Omit<DeviceRegisterRequest, 'pageNum' | 'pageSize'>
const searchParams = ref<SearchParams>({
    siteId: '',
    status: '',
    county: '',
    city: '',
    province: ''
})

const store = useDeviceRegisterListStore()
const route = useRoute()
const router = useRouter()
const statusOptions = ref([
    {
        label: '未注册',
        value: '0'
    },
    {
        label: '注册中',
        value: '1'
    },
    {
        label: '已注册',
        value: '2'
    },
    {
        label: '全部',
        value: ''
    }
])

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

const pageTitle = computed(() => {
    return (route.meta.title as string) || '加油站管理'
})
const handleClose = () => {
    registerDeviceVisible.value = false // 关闭弹窗
    loadData()
}
const handleSearch = () => {
    if (!areaValue.value) {
        searchParams.value.county = ''
        searchParams.value.city = ''
        searchParams.value.province = ''
    }
    loadData()
}
const handleReset = () => {
    areaValue.value = ''
    const defaultSearchParams = {
        siteId: '',
        status: '',
        county: '',
        city: '',
        province: ''
    }
    searchParams.value = { ...defaultSearchParams }
    pagination.value = {
        page: 1,
        pageSize: 10,
        itemCount: 0
    }
    loadData()
}

const { height } = useWindowSize()
const tableHeight = ref(height.value - 340)

watch(
    () => height.value,
    (newVal) => {
        tableHeight.value = newVal - 340
    }
)

const rowKey = (row: RowData) => row.id

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
        key: 'siteName',
        minWidth: 200,
        maxWidth: 240,
        ellipsis: {
            tooltip: true
        },
        fixed: 'left'
    },
    {
        title: '地区',
        key: 'areaName',
        minWidth: 160,
        ellipsis: { tooltip: true }
    },
    {
        title: '加油机名称',
        key: 'tankerName',
        minWidth: 160
    },
    {
        title: '加油机设备编号',
        key: 'skDeviceSn',
        minWidth: 230,
        align: 'center',
        render(row: RowData) {
            return (
                <n-space justify="center">
                    <ClipboardText text={row.skDeviceSn as string} />
                </n-space>
            )
        }
    },
    {
        title: '注册状态',
        key: 'skRegisterFlag',
        minWidth: 120,
        align: 'center',
        filterOptions: [
            { label: '未注册', value: '0' },
            { label: '注册中', value: '1' },
            { label: '已注册', value: '2' }
        ],
        render(row: RowData) {
            let type = 'warning',
                text = '未注册'
            switch (row.status) {
                case '1':
                    type = 'info'
                    text = '注册中'
                    break
                case '2':
                    type = 'success'
                    text = '已注册'
                    break
                default:
                    type = 'default'
                    text = '未注册'
                    break
            }
            return (
                <n-tag size="small" type={type}>
                    {text}
                </n-tag>
            )
        }
    },
    {
        title: '创建时间',
        key: 'createTime',
        minWidth: 180,
        align: 'center'
    },
    {
        title: '操作',
        key: 'actions',
        width: 260,
        align: 'center',
        fixed: 'right',
        render(row: RowData) {
            return (
                <n-space justify="center" wrap={false}>
                    <n-button
                        type="info"
                        tertiary
                        size="tiny"
                        onClick={() => handleRefreshItem(row.id)}
                    >
                        {{
                            icon: () => <icon-ant-design-reload-outlined />,
                            default: () => '刷新'
                        }}
                    </n-button>
                    <n-popconfirm
                        onPositiveClick={() => handleRegisterDevice(row)}
                    >
                        {{
                            trigger: () => (
                                <n-button type="primary" tertiary size="tiny">
                                    {{
                                        icon: () => (
                                            <icon-carbon-intent-request-create />
                                        ),
                                        default: () =>
                                            row.type == '0'
                                                ? '去注册'
                                                : '重新注册'
                                    }}
                                </n-button>
                            ),
                            default: () =>
                                row.type === '0'
                                    ? '确定要注册设备吗？'
                                    : '确定要重新注册设备吗？'
                        }}
                    </n-popconfirm>
                    <n-button
                        type="primary"
                        tertiary
                        size="tiny"
                        onClick={() => {
                            handleView(row)
                        }}
                    >
                        {{
                            icon: () => <icon-ant-design-file-text-outlined />,
                            default: () => '详情'
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

// const handleCheck = (rowKeys: DataTableRowKey[]) => {
//   checkedRowKeysRef.value = rowKeys;
// };

watch(checkedRowKeysRef, (v, _ov) => {
    checkedCollapsed.value = v.length > 0
})

/** ================== 操作 ================= */
type ModalType = 'add' | 'edit'

const { bool: visible, setTrue: openModal } = useBoolean()

const { bool: registerDeviceVisible, setTrue: openRegisterDeviceModal } =
    useBoolean()

const editData = ref<RowData | null>(null)
const machineData = ref<RowData | null>(null)
function setEditData(data: RowData | null) {
    editData.value = data
}
function setMachineData(data: RowData | null) {
    machineData.value = data
}

const handleCreate = () => {
    // openRegisterDeviceModal();
    router.push('/register_device')
}

const handleRegisterDevice = (row: RowData) => {
    setMachineData(row)
    openRegisterDeviceModal()
}

const handleRefreshItem = async (id: number) => {
    await store.refreshDevice(id).then((data) => {
        dataSource.value.map((item) => {
            if (item.id === data.id) {
                return data
            }
        })
    })
    await loadData()
}

/** 详情操作 */
const handleView = (row: RowData) => {
    setEditData(row)
    openModal()
}

const handleSubmit = () => {
    // 提交表单
    console.log('提交表单')
}
</script>
