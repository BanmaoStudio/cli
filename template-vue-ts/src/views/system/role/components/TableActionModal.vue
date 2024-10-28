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
                <n-form-item-gi label="角色名称" path="roleName">
                    <n-input
                        v-model:value="formModel.roleName"
                        placeholder="请输入角色名称"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="角色状态" path="status">
                    <n-switch
                        v-model:value="formModel.status"
                        :checked-value="'0'"
                        :unchecked-value="'1'"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="排序" path="roleSort">
                    <n-input-number
                        v-model:value="formModel.roleSort"
                        placeholder="请输入排序"
                        :min="1"
                    />
                </n-form-item-gi>

                <n-form-item-gi label="备注" path="remark">
                    <n-input
                        v-model:value="formModel.remark"
                        placeholder="请输入备注（可选）"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="权限" path="menuIds">
                    <div
                        style="
                            display: flex;
                            flex-direction: column;
                            align-items: left;
                            margin-top: 5px;
                        "
                    >
                        <n-space class="mb-5px">
                            <n-checkbox
                                :checked="allSelected"
                                @update:checked="toggleCheckAll"
                            >
                                全选
                            </n-checkbox>

                            <n-checkbox
                                :checked="allExpanded"
                                @update:checked="toggleExpandAll"
                            >
                                展开
                            </n-checkbox>
                        </n-space>

                        <n-tree
                            :data="treeData"
                            v-model:checked-keys="formModel.menuIds"
                            v-model:expanded-keys="expandedKeys"
                            checkable
                            cascade
                            :expand-on-click-node="false"
                            style="max-height: 300px; overflow-y: auto"
                        />
                    </div>
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
import { useRoleStore } from '../store'
import { useDeviceScreen } from '@/hooks'

export interface Props {
    visible: boolean
    type?: 'add' | 'edit'
    editData?: any
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'RoleTableActionModel' })

const props = withDefaults(defineProps<Props>(), {
    type: 'add',
    editData: null
})
const allExpanded = ref(false)

const treeData = ref<any[]>([])
const emit = defineEmits<Emits>()
const store = useRoleStore()
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
        add: '新增角色',
        edit: '编辑角色'
    }
    return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

function createDefaultFormModel(): any {
    return {
        status: '0',
        remark: '',
        roleName: '',
        roleSort: null,
        menuIds: []
    }
}

const formModel = reactive<any>(createDefaultFormModel())

const rules: any = {
    roleName: { required: true, message: '请填写角色名称', trigger: 'blur' },
    status: {
        required: true,
        message: '请选择账号状态',
        trigger: 'blur'
    },
    roleSort: {
        required: true,
        message: '请输入排序',
        type: 'number',
        trigger: 'blur'
    }
}

function handleUpdateFormModel(model: Partial<any>) {
    Object.assign(formModel, model)
}

function transformToTreeData(data) {
    if (!Array.isArray(data)) {
        return []
    }

    return data.map((item) => ({
        label: item.name || '',
        key: item.id ? item.id.toString() : '',
        children:
            item.children && item.children.length > 0
                ? transformToTreeData(item.children)
                : []
    }))
}
// 使用示例
const allMenuKeys = ref([])
async function getAllMenuList() {
    const res = await store.getAllRole()
    if (res) {
        // 调用转换函数
        const menuData = res || []
        treeData.value = transformToTreeData(menuData)

        allMenuKeys.value = collectAllKeys(treeData.value)
    }
}
const collectAllKeys = (data) => {
    const keys = []
    const collectKeysRecursively = (nodes) => {
        nodes.forEach((node) => {
            const keyAsNumber = node.key
            if (!isNaN(keyAsNumber)) {
                keys.push(keyAsNumber)
            }
            if (node.children && node.children.length > 0) {
                collectKeysRecursively(node.children)
            }
        })
    }
    collectKeysRecursively(data)
    return keys
}

// 存储展开状态的节点 key
const expandedKeys = ref<string[]>([])

// 是否全部展开
const expandAll = ref(false)

// 展开/收起功能
const toggleExpandAll = () => {
    expandAll.value = !expandAll.value
    if (expandAll.value) {
        expandedKeys.value = collectKeys(treeData.value)
    } else {
        expandedKeys.value = []
    }
}

const allSelected = ref(false) // 用来跟踪是否已经全选

// 递归收集所有的 key
const collectKeys = (data) => {
    const keys = []
    data.forEach((item) => {
        keys.push(item.key)
        if (item.children && item.children.length > 0) {
            keys.push(...collectKeys(item.children))
        }
    })
    return keys
}
watch(
    () => props.editData,
    (newValue) => {
        if (newValue.menuIds.length >= allMenuKeys.value.length) {
            allSelected.value = true
        } else {
            allSelected.value = false
        }
    }
)
// 全选/取消全选功能
const toggleCheckAll = () => {
    if (allSelected.value) {
        // 取消全选
        formModel.menuIds = []
        allSelected.value = false
    } else {
        // 全选
        const allKeys = collectKeys(treeData.value)
        formModel.menuIds = allKeys
        allSelected.value = true
    }
}

watch(
    () => formModel.menuIds,
    (newValue) => {
        if (newValue.length > 0) {
            allSelected.value = allMenuKeys.value.every((key) =>
                newValue.includes(key)
            )
        }
    }
)
function handleUpdateFormModelByModalType() {
    const handlers: Record<ModalType, () => void> = {
        add: () => {
            const defaultFormModel = createDefaultFormModel()
            handleUpdateFormModel(defaultFormModel)
        },
        edit: () => {
            if (props.editData) {
                const { id, menuIds, ...editData } = props.editData
                const menuIdsArray = menuIds.map((num) => num.toString())
                handleUpdateFormModel({
                    menuIds: menuIdsArray,
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
                const res = await store.getAddRole({
                    ...formModel
                })
                if (res.status === 0) {
                    message.success(res.data || '新增成功')
                }
            } else {
                const res = await store.getUpdateRole({
                    ...formModel,
                    id: props.editData?.id
                })
                if (res.status === 0) {
                    message.success(res.data || '修改成功')
                }
            }
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
            if (props.type === 'add') {
                allSelected.value = false
            }
            getAllMenuList()
            handleUpdateFormModelByModalType()
        }
    }
)
</script>
