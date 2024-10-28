<template>
    <n-modal
        v-model:show="modalVisible"
        preset="card"
        :title="title"
        class="w-700px lt-sm:w-full"
    >
        <n-form
            ref="formRef"
            :label-placement="labelPlacement"
            :label-width="120"
            :model="formModel"
            :rules="rules"
        >
            <n-grid :x-gap="18" cols="1" responsive="screen">
                <n-form-item-gi label="菜单名称" path="name">
                    <n-input
                        v-model:value="formModel.name"
                        placeholder="请输入展示名称"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="路由名称" path="nameEn">
                    <n-input
                        v-model:value="formModel.nameEn"
                        placeholder="唯一英文字符串"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="路由地址" path="url">
                    <n-input
                        v-model:value="formModel.url"
                        placeholder="唯一英文字符串"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="上级菜单" path="pid">
                    <n-cascader
                        v-model:value="formModel.pid"
                        :options="pidOptions"
                        value-field="id"
                        placeholder="上级菜单"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="图标" path="icon">
                    <!-- <n-select
                        v-model:value="formModel.icon"
                        :options="iconOptions"
                        placeholder="请选择图标"
                    /> -->
                    <icon-picker v-model:value="formModel.icon" />
                </n-form-item-gi>

                <n-form-item-gi label="排序标记" path="weight">
                    <n-input-number v-model:value="formModel.weight" :min="0" />
                </n-form-item-gi>
                <n-form-item-gi label="状态" path="status">
                    <n-switch
                        v-model:value="formModel.status"
                        :checked-value="0"
                        :unchecked-value="1"
                    />
                </n-form-item-gi>
            </n-grid>

            <n-space class="w-full pt-16px" :size="24" justify="end">
                <n-button class="w-72px" @click="closeModal"> 取消 </n-button>
                <n-button class="w-72px" type="primary" @click="handleSubmit">
                    确定
                </n-button>
            </n-space>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInst } from 'naive-ui'

import IconPicker from '@/components/IconPicker/index.vue'

import { useMenuStore } from '../store'
import { useDeviceScreen } from '@/hooks'

export interface Props {
    visible: boolean
    type?: 'add' | 'edit'
    editData?: any
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'MenuTableActionModel' })

const props = withDefaults(defineProps<Props>(), {
    type: 'add',
    editData: null
})
const pidOptions = ref<any[]>([])
const iconOptions = ref<any[]>([])
const emit = defineEmits<Emits>()
const store = useMenuStore()
const message = useMessage()
const { isMobile } = useDeviceScreen()

const labelPlacement = computed(() => {
    return isMobile ? 'top' : 'left'
})

interface Emits {
    (e: 'update:visible', visible: boolean): void
}

const modalVisible = computed({
    get() {
        return props.visible
    },
    set(visible) {
        emit('update:visible', visible)
    }
})

function closeModal() {
    modalVisible.value = false
}

const title = computed(() => {
    const titles: Record<ModalType, string> = {
        add: '新增菜单',
        edit: '编辑菜单'
    }
    return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

function createDefaultFormModel(): any {
    return {
        status: 0,
        url: '',
        // icon: '',
        name: '',
        weight: 1,
        pid: 0,
        nameEn: ''
    }
}

const formModel = reactive<any>(createDefaultFormModel())

const rules: any = {
    nameEn: { required: true, message: '请填写路由名称', trigger: 'blur' },
    url: { required: true, message: '请填写路由地址', trigger: 'blur' },
    name: { required: true, message: '请填写展示名称', trigger: 'blur' },
    pid: {
        required: true,
        message: '请选择上级菜单',
        type: 'number',
        trigger: 'blur'
    },
    status: {
        required: true,
        message: '请选择账号状态',
        type: 'number',
        trigger: 'blur'
    },
    weight: {
        required: true,
        message: '请输入排序',
        type: 'number',
        trigger: 'blur'
    }
}

function handleUpdateFormModel(model: Partial<any>) {
    Object.assign(formModel, model)
}

async function getAllMenuList() {
    const res = await store.getMenuOptions()
    if (res) {
        // 在数组开头添加根目录项
        const rootOption = { id: 0, label: '根目录' }
        pidOptions.value = [rootOption, ...res]
    }
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
            if (props.type === 'add') {
                const res = await store.getAddMenu({
                    ...formModel
                })
                if (res.status === 0) {
                    message.success('添加成功')
                }
            } else {
                const res = await store.getEditMenu({
                    ...formModel,
                    id: props.editData?.id
                })
                if (res.status === 0) {
                    message.success('修改成功')
                }
            }
            // 清空表单内容和校验状态
            formRef.value?.restoreValidation()
            // 重置表单模型为默认值
            handleUpdateFormModel(createDefaultFormModel())
            await closeModal()
        } else {
            console.error(errors)
            message.error('验证失败')
        }
    })
}

watch(
    () => props.visible,
    (newValue) => {
        if (newValue) {
            getAllMenuList()
            handleUpdateFormModelByModalType()
        }
    }
)
</script>
