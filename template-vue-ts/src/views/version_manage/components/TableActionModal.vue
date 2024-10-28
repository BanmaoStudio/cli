<template>
    <n-modal
        v-model:show="modalVisible"
        preset="card"
        :title="title"
        class="w-800px lt-sm:w-400"
    >
        <n-form
            ref="formRef"
            :label-placement="labelPlacement"
            :label-width="120"
            :model="formModel"
            :rules="rules"
            :show-require-mark="false"
        >
            <n-grid
                :cols="24"
                :x-gap="18"
                item-responsive
                class="lt-sm:mb-16px"
            >
                <n-form-item-gi :span="24" label="类型" path="type">
                    <n-select
                        v-model:value="formModel.type"
                        :options="[
                            { label: 'MCU', value: '0' },
                            { label: '4G', value: '1' }
                        ]"
                        placeholder="固件包类型"
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="版本号" path="version">
                    <n-input
                        v-model:value="formModel.version"
                        placeholder="版本号"
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="固件包地址" path="url">
                    <n-input
                        v-model:value="formModel.url"
                        placeholder="固件包地址"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="状态" path="status">
                    <n-switch
                        v-model:value="formModel.status"
                        checked-value="0"
                        unchecked-value="1"
                    >
                        <template #checked>启用</template>
                        <template #unchecked>关闭</template>
                    </n-switch>
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="备注" path="remark">
                    <n-input
                        v-model:value="formModel.remark"
                        type="textarea"
                        placeholder="备注"
                    />
                </n-form-item-gi>
            </n-grid>
            <n-space
                class="w-full pt-16px lt-sm:fixed lt-sm:py-10px lt-sm:px-24px lt-sm:left-0 lt-sm:right-0 lt-sm:bottom-0 lt-sm:bg-white lt-sm:shadow-md"
                :size="24"
                justify="end"
            >
                <n-button class="w-72px" @click="closeModal">取消</n-button>
                <n-button class="w-72px" type="primary" @click="handleSubmit"
                    >确定</n-button
                >
            </n-space>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useVersionManageStore } from '../store'
import { useDeviceScreen } from '@/hooks'

import type { FormInst, FormItemRule } from 'naive-ui'
import type { PackageForm } from '../types'

export interface Props {
    /** 弹窗可见性 */
    visible: boolean
    /**
     * 弹窗类型
     * add: 新增
     * edit: 修改
     */
    type?: 'add' | 'edit'
    /** 编辑的表格行数据 */
    editData?: any | null
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'VersionManageTableActionModel' })

const store = useVersionManageStore()
const message = useMessage()
const { isMobile } = useDeviceScreen()

const labelPlacement = computed(() => {
    return isMobile ? 'top' : 'left'
})

const props = withDefaults(defineProps<Props>(), {
    type: 'add',
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

const closeModal = () => {
    modalVisible.value = false
}

const title = computed(() => {
    const titles: Record<ModalType, string> = {
        add: '新增固件包',
        edit: '编辑固件包'
    }
    return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

type PackageFormModel = Omit<PackageForm, 'id'>

function createDefaultFormModel(): PackageFormModel {
    return {
        type: '0',
        version: '',
        url: '',
        status: '0'
    }
}

const currentId = ref<number | null>(null)
const formModel = reactive<PackageFormModel>(createDefaultFormModel())

const rules: Record<keyof PackageFormModel, FormItemRule | FormItemRule[]> = {
    type: [{ required: true, message: '请选择类型' }],
    version: [{ required: true, message: '请填写版本号' }],
    url: [{ required: true, message: '请填写下载地址' }],
    status: [{ required: true, message: '请选择状态' }],
    remark: []
}

function handleUpdateFormModel(model: Partial<PackageFormModel>) {
    Object.assign(formModel, model)
}

function handleUpdateFormModelByModalType() {
    const handlers: Record<ModalType, () => void> = {
        add: () => {
            const defaultFormModel = createDefaultFormModel()
            handleUpdateFormModel(defaultFormModel)
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

function handleSubmit() {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            // message.success('新增成功!')

            if (props.type === 'add') {
                const result = await store.addData(formModel)
            } else if (props.type === 'edit') {
                const result = await store.editData({
                    id: currentId.value as unknown as number,
                    ...formModel
                })
            }
            closeModal()
        } else {
            console.log(errors)
            message.error('验证失败')
        }
    })
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
