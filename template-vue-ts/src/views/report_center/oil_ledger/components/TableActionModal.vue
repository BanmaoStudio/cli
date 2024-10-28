<template>
    <n-drawer v-model:show="modalVisible" :width="1200" placement="right">
        <n-drawer-content :title="title" closable>
            <n-card class="mb-4">
                <n-descriptions
                    :title="editData.siteName"
                    label-placement="left"
                    :column="2"
                >
                    <n-descriptions-item label="地区">
                        {{ editData.areaName }}
                    </n-descriptions-item>
                    <n-descriptions-item label="液位仪编号">
                        <clipboard-text :text="editData.deviceNum" />
                    </n-descriptions-item>
                    <n-descriptions-item label="总进油量">
                        {{ editData.inputSum }} L
                    </n-descriptions-item>
                    <n-descriptions-item label="总出油量">
                        {{ editData.outputSum }} L
                    </n-descriptions-item>
                    <n-descriptions-item label="总销售量">
                        {{ editData.saleSum }} L
                    </n-descriptions-item>
                    <n-descriptions-item label="时间">
                        {{ editData.time }}
                    </n-descriptions-item>
                </n-descriptions>
            </n-card>
            <Details />
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import Details from '../oil_ledger_details/index.vue'
import { OilLedgerItem } from '../types'
import { useWindowSize } from '@vueuse/core'
import ClipboardText from '@/components/common/ClipboardText.vue'

const { height } = useWindowSize()

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

defineOptions({ name: 'OilLedgerTableActionModel' })

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
        view: '进出油台账详情',
        edit: '编辑'
    }
    return titles[props.type]
})

type LevelDataFormModel = Pick<OilLedgerItem, 'deviceNum'>

function createDefaultFormModel(): LevelDataFormModel {
    return {
        deviceNum: ''
    }
}

const currentId = ref<number | null>(null)
const formModel = reactive<LevelDataFormModel>(createDefaultFormModel())

function handleUpdateFormModel(model: Partial<LevelDataFormModel>) {
    Object.assign(formModel, model)
}
function handleUpdateFormModelByModalType() {
    const handlers: Record<ModalType, () => void> = {
        view: () => {
            if (props.editData) {
                const { id, ...editData } = props.editData
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

watch(
    () => props.visible,
    (newValue) => {
        if (newValue) {
            handleUpdateFormModelByModalType()
        }
    }
)
</script>
