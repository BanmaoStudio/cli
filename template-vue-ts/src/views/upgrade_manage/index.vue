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
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            @update:checked="handleCheck"
        />
        <upgrade-modal
            v-model:visible="upgradeVisible"
            :type="packageType"
            :data="upgradeData"
        />
    </n-layout>
</template>

<script setup lang="tsx">
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useUpgradeManageStore } from './store'
import { useBoolean, useList } from '@/hooks'
import { useToggle, useWindowSize } from '@vueuse/core'
import ClipboardText from '@/components/common/ClipboardText.vue'
import UpgradeModal, { UpgradeData } from './components/UpgradeModal.vue'

import type { UpgradeManageItem, UpgradeManageRequest } from './types'

defineOptions({ name: 'UpgradeManagePage' })

type RowData = UpgradeManageItem

type SearchParams = Omit<UpgradeManageRequest, 'pageNum' | 'pageSize'>

const store = useUpgradeManageStore()
const route = useRoute()

const pageTitle = computed(() => {
    return (route.meta.title as string) || '维护升级'
})

const rowKey = (row: RowData) => row.id

const searchParams = ref<SearchParams>({})

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
    { title: '加油站名称', key: 'siteName', minWidth: 250, fixed: 'left' },
    {
        title: '加油机名称',
        key: 'tankerName',
        width: 350
    },
    {
        title: '加油机设备编号',
        key: 'skDeviceSn',
        width: 350,
        render(row: RowData) {
            return <ClipboardText text={row.skDeviceSn as string} />
        }
    },
    {
        title: 'MCU版本',
        key: 'skMcuFirmwareVer',
        width: 200,
        render(row: RowData) {
            return (
                <div className="flex-y-center justify-start">
                    {row.skMcuFirmwareVer}
                    {row.skMcuFlag === 2 ? (
                        <n-button
                            type="primary"
                            quaternary
                            circle
                            size="small"
                            onClick={() =>
                                handleUpgradeVersionModal('mcu', row)
                            }
                        >
                            {{
                                icon: () => (
                                    <icon-carbon-upgrade class="text-16px" />
                                )
                            }}
                        </n-button>
                    ) : (
                        ''
                    )}
                </div>
            )
        }
    },
    {
        title: '4G固件版本',
        width: 200,
        key: 'sk4gFirmwareVer',
        render(row: RowData) {
            return (
                <div className="flex-y-center justify-start">
                    {row.sk4gFirmwareVer}
                    {row.sk4gFlag === 2 ? (
                        <n-button
                            type="primary"
                            quaternary
                            circle
                            size="small"
                            onClick={() => handleUpgradeVersionModal('4g', row)}
                        >
                            {{
                                icon: () => (
                                    <icon-carbon-upgrade class="text-16px" />
                                )
                            }}
                        </n-button>
                    ) : (
                        ''
                    )}
                </div>
            )
        }
    },
    {
        title: '升级时间',
        key: 'upgradeTime',
        width: 200
    },
    {
        title: '操作',
        key: 'actions',
        width: 120,
        align: 'center',
        fixed: 'right',
        render(row: RowData) {
            return (
                <n-space justify="center">
                    <n-button
                        type="primary"
                        tertiary
                        size="tiny"
                        onClick={() => handleUpgradeVersionModal('all', row)}
                    >
                        升级
                    </n-button>
                </n-space>
            )
        }
    }
]) as Ref<DataTableColumns<RowData>>

/** 数据查询操作 */

/** 多选操作 */
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const checkedCollapsed = ref(false)

const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeysRef.value = rowKeys
}

watch(checkedRowKeysRef, (v, _ov) => {
    checkedCollapsed.value = v.length > 0
})

/** ================== 升级操作 ================= */
type UpdateModalType = 'mcu' | '4g' | 'all'
const { bool: upgradeVisible, setTrue: openUpgradeModal } = useBoolean()

const packageType = ref<'0' | '1' | '2'>('2')

const upgradeData = ref<UpgradeData>({
    id: '',
    version: '',
    siteName: '',
    tankerName: ''
})

function handleUpgradeVersionModal(type: UpdateModalType, row: RowData) {
    switch (type) {
        case 'mcu':
            packageType.value = '0'
            break
        case '4g':
            packageType.value = '1'
            break
        case 'all':
            packageType.value = '2'
            break
    }
    upgradeData.value = {
        id: row.id,
        version: row.version,
        siteName: row.siteName,
        tankerName: row.tankerName,
        ...row
    }
    openUpgradeModal()
}
</script>
