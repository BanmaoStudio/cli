<template>
    <!-- <n-modal
        v-model:show="modalVisible"
        preset="card"
        :title="title"
        class="w-800px lt-sm:w-400"
    >
     
        <n-descriptions :columns="2" label-placement="left">
            <n-descriptions-item
                label="加油站名称"
                :label-style="{ fontSize: '15px' }"
            >
                <span :style="{ fontWeight: 600, fontSize: '15px' }">{{
                    formModel.siteName
                }}</span>
            </n-descriptions-item>
            <n-descriptions-item
                label="加油机名称"
                :label-style="{ fontSize: '15px' }"
            >
                <span :style="{ fontWeight: 600, fontSize: '15px' }">
                    {{ formModel.tankerName }}</span
                >
            </n-descriptions-item>
            <n-descriptions-item
                label="加油机设备编号"
                :label-style="{ fontSize: '15px' }"
            >
                <span :style="{ fontWeight: 600, fontSize: '15px' }">
                    {{ formModel.skDeviceSn }}</span
                >
            </n-descriptions-item>
            <n-descriptions-item
                label="注册状态"
                :label-style="{ fontSize: '15px' }"
            >
                <span :style="{ fontWeight: 600, fontSize: '15px' }">
                    {{
                        formModel.status === '1'
                            ? '注册中'
                            : formModel.status === '2'
                              ? '已注册'
                              : '未注册'
                    }}
                </span>
            </n-descriptions-item>
            <n-descriptions-item
                label="MCU版本"
                :label-style="{ fontSize: '15px' }"
            >
                <span :style="{ fontWeight: 600, fontSize: '15px' }">
                    {{ formModel.skMcuFirmwareVer }}</span
                >
            </n-descriptions-item>
            <n-descriptions-item
                label="4G固本版本"
                :label-style="{ fontSize: '15px' }"
            >
                <span :style="{ fontWeight: 600, fontSize: '15px' }">
                    {{ formModel.sk4gFirmwareVer }}</span
                >
            </n-descriptions-item>
            <n-descriptions-item
                label="注册时间"
                :label-style="{ fontSize: '15px' }"
            >
                <span :style="{ fontWeight: 600, fontSize: '15px' }">
                    {{ formModel.createTime }}</span
                >
            </n-descriptions-item>
        </n-descriptions>
        <n-divider />

        <n-data-table :columns="resultColumns" :data="dataSource" />
    </n-modal> -->

    <n-drawer v-model:show="modalVisible" :width="800">
        <n-drawer-content :title="title" closable>
            <n-grid x-gap="12" y-gap="30" :cols="1">
                <n-gi>
                    <!-- 内容 -->
                    <n-descriptions :columns="2" label-placement="left">
                        <n-descriptions-item
                            label="加油站名称"
                            :label-style="{ fontSize: '15px' }"
                        >
                            <span
                                :style="{ fontWeight: 600, fontSize: '15px' }"
                                >{{ formModel.siteName }}</span
                            >
                        </n-descriptions-item>
                        <n-descriptions-item
                            label="加油机名称"
                            :label-style="{ fontSize: '15px' }"
                        >
                            <span
                                :style="{ fontWeight: 600, fontSize: '15px' }"
                            >
                                {{ formModel.tankerName }}</span
                            >
                        </n-descriptions-item>
                        <n-descriptions-item
                            label="加油机设备编号"
                            :label-style="{ fontSize: '15px' }"
                        >
                            <span
                                :style="{ fontWeight: 600, fontSize: '15px' }"
                            >
                                {{ formModel.skDeviceSn }}</span
                            >
                        </n-descriptions-item>
                        <n-descriptions-item
                            label="注册状态"
                            :label-style="{ fontSize: '15px' }"
                        >
                            <span
                                :style="{ fontWeight: 600, fontSize: '15px' }"
                            >
                                {{
                                    formModel.status === '1'
                                        ? '注册中'
                                        : formModel.status === '2'
                                          ? '已注册'
                                          : '未注册'
                                }}
                            </span>
                        </n-descriptions-item>
                        <n-descriptions-item
                            label="MCU版本"
                            :label-style="{ fontSize: '15px' }"
                        >
                            <span
                                :style="{ fontWeight: 600, fontSize: '15px' }"
                            >
                                {{ formModel.skMcuFirmwareVer }}</span
                            >
                        </n-descriptions-item>
                        <n-descriptions-item
                            label="4G固本版本"
                            :label-style="{ fontSize: '15px' }"
                        >
                            <span
                                :style="{ fontWeight: 600, fontSize: '15px' }"
                            >
                                {{ formModel.sk4gFirmwareVer }}</span
                            >
                        </n-descriptions-item>
                        <n-descriptions-item
                            label="注册时间"
                            :label-style="{ fontSize: '15px' }"
                        >
                            <span
                                :style="{ fontWeight: 600, fontSize: '15px' }"
                            >
                                {{ formModel.createTime }}</span
                            >
                        </n-descriptions-item>
                    </n-descriptions>
                </n-gi>
                <n-gi>
                    <n-card title="报警信息">
                        <n-data-table
                            :columns="resultColumns"
                            :data="dataSource"
                        />
                    </n-card>
                </n-gi>
            </n-grid>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useDeviceRegisterListStore } from '../store'

import type { DeviceRegisterResult } from '../types'

export interface Props {
    /** 弹窗可见性 */
    visible: boolean
    /**
     * 弹窗类型
     * view: 查看
     * edit: 修改
     */
    type?: 'view' | 'edit'
    /** 编辑的表格行数据 */
    editData?: any | null
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'DeviceRegisterTableActionModel' })

const store = useDeviceRegisterListStore()

type tableDate = {
    gunNo: number //枪号
    msg: string //报警内容
    status: string //状态
    createTime: string //报警时间
    recoveryTime: string //恢复时间
}
const dataSource = ref<tableDate[]>([])
const props = withDefaults(defineProps<Props>(), {
    type: 'view',
    editData: null
})

interface Emits {
    (e: 'update:visible', visible: boolean): void
}

const emit = defineEmits<Emits>()

const modalVisible = computed({
    get() {
        return props.visible
    },
    set(visible) {
        emit('update:visible', visible)
    }
})

const title = computed(() => {
    const titles: Record<ModalType, string> = {
        view: '详情',
        edit: '编辑'
    }
    return titles[props.type]
})

type GasStationFormModel = Omit<DeviceRegisterResult, 'id'>

function createDefaultFormModel(): GasStationFormModel {
    return {
        siteName: '',
        tankerName: '',
        skDeviceSn: '',
        status: '',
        type: '',
        sk4gFirmwareVer: '',
        skMcuFirmwareVer: ''
    }
}

const currentId = ref<number | null>(null)
const formModel = reactive<GasStationFormModel>(createDefaultFormModel())

function handleUpdateFormModel(model: Partial<GasStationFormModel>) {
    Object.assign(formModel, model)
}
function handleUpdateFormModelByModalType() {
    const handlers: Record<ModalType, () => void> = {
        view: () => {
            if (props.editData) {
                const { id, ...editData } = props.editData
                store.historyDetails(id).then((data: any) => {
                    formModel.skMcuFirmwareVer = data.device.skMcuFirmwareVer
                    formModel.sk4gFirmwareVer = data.device.sk4gFirmwareVer
                    if (data && data.skAlarmRecords) {
                        const transformedData = data.skAlarmRecords.map(
                            (record) => ({
                                gunNo: record.gunNo,
                                msg: record.msg,
                                status: record.status,
                                createTime: record.createTime,
                                recoveryTime: record.recoveryTime
                            })
                        )
                        // 更新dataSource
                        dataSource.value = transformedData
                        dataSource.value.forEach((item, index) => {
                            item.index = index + 1
                        })
                    }
                })
                currentId.value = id
                handleUpdateFormModel({
                    ...editData
                })
            }
        },
        edit: () => {
            if (props.editData) {
                const { id, ...editData } = props.editData
                currentId.value = id
                handleUpdateFormModel({
                    ...editData
                })
            }
        }
    }

    handlers[props.type]()
}

const resultColumns = [
    { title: '序号', key: 'index', width: 80, align: 'center' },
    { title: '枪号', key: 'gunNo', align: 'center' },
    { title: '报警内容', key: 'msg', align: 'center' },
    {
        title: '状态',
        key: 'status',
        align: 'center',
        render: (record) => (record.status === '0' ? '未恢复' : '已恢复')
    },
    { title: '报警时间', key: 'createTime', align: 'center' },
    { title: '恢复时间', key: 'recoveryTime', align: 'center' }
]

watch(
    () => props.visible,
    (newValue) => {
        if (newValue) {
            handleUpdateFormModelByModalType()
        }
    }
)
</script>
