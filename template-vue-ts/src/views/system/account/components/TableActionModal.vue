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
            :show-require-mark="false"
        >
            <n-grid :x-gap="18" cols="1" responsive="screen">
                <n-form-item-gi label="账号" path="username">
                    <ClipboardText
                        v-if="props.type === 'edit'"
                        class="font-bold"
                        :text="formModel.username"
                    />
                    <n-input
                        v-else
                        v-model:value="formModel.username"
                        placeholder="请输入账号名称"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="用户名" path="name">
                    <n-input
                        v-model:value="formModel.name"
                        placeholder="请输入用户名"
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    label="密码"
                    path="password"
                    v-if="props.type === 'add'"
                >
                    <n-input
                        v-model:value="formModel.password"
                        placeholder="请输入密码"
                        show-password-on="mousedown"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="所属角色" path="roleIds">
                    <n-select
                        v-model:value="formModel.roleIds"
                        multiple
                        :options="roleList"
                        label-field="roleName"
                        value-field="roleId"
                        placeholder="请选择角色"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="账号状态" path="status">
                    <n-switch
                        v-model:value="formModel.status"
                        :checked-value="'0'"
                        :unchecked-value="'1'"
                    />
                </n-form-item-gi>
                <n-form-item-gi label="经度" path="lng">
                    <n-input v-model:value="formModel.lng" placeholder="经度" />
                </n-form-item-gi>
                <n-form-item-gi label="维度" path="lat">
                    <n-input v-model:value="formModel.lat" placeholder="维度" />
                </n-form-item-gi>
                <!-- <n-form-item-gi label="所属地区" path="areaCode">
          <n-select
            v-model:value="formModel.areaCode"
            :disabled="type === 'edit'"
            type="number"
            :options="areaList"
            placeholder="所属地区"
            :maxlength="10"
            :minlength="10"
          />
        </n-form-item-gi> -->
            </n-grid>
            <n-space class="w-full pt-16px" :size="24" justify="end">
                <n-button class="w-72px" @click="closeModal">取消</n-button>
                <n-button class="w-72px" type="primary" @click="handleSubmit"
                    >确定</n-button
                >
            </n-space>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useAuthStore, useCommonStore } from '@/store'
import { useAccountStore } from '../store'
import { useDeviceScreen } from '@/hooks'
import { CryptoAES } from '@/utils/crypto'

import type { FormInst, FormItemRule } from 'naive-ui'
import type { Account, AccountForm, Role } from '../types'
import type { AreaCodeItem } from '@/services/common/types'

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
    editData?: AccountForm | null
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'AccountTableActionModel' })

const commonStore = useCommonStore()
const authStore = useAuthStore()
const store = useAccountStore()
const message = useMessage()
const { isMobile } = useDeviceScreen()

const labelPlacement = computed(() => {
    return isMobile ? 'top' : 'left'
})

// const areaList = computed(() => commonStore.areaList);
// const gasStationTypeOptions = computed(() => commonStore.gasStationTypeList)

// const getSubLevelAreaList = async () => {
//   const currentUserAreaCode = authStore.areaCode;
//   try {
//     const result = await commonStore.getAreaList(currentUserAreaCode);
//     if (result.length > 0) {
//       areaList.value.push(
//         ...new Set(
//           result.map((item: AreaCodeItem) => ({
//             label: item.name,
//             value: Number(item.code),
//           })),
//         ),
//       );
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// function init() {
//   // getSubLevelAreaList()
//   if (areaList.value.length <= 0) {
//     commonStore.getAreaList(authStore.areaCode);
//   }
// }
// onMounted(() => {
//   init();
// });

const roleList = ref([])

async function handleRoleList() {
    try {
        const res: any = await store.getAllRole()
        const transformedRes = res.map((role: any) => ({
            ...role,
            roleId: String(role.roleId)
        }))

        roleList.value = transformedRes
    } catch (error) {
        console.error('Failed to fetch role list:', error)
    }
}

onMounted(() => {
    handleRoleList()
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
        add: '添加账号',
        edit: '修改账号'
    }
    return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

type AccountFormModel = Omit<Account, 'id' | 'createTime'>
type AccountRules = Omit<
    Account,
    'id' | 'createTime' | 'lat' | 'lng' | 'roleNames' | 'key'
>

function createDefaultFormModel(): AccountFormModel {
    return {
        name: '',
        username: '',
        status: '0',
        lat: '',
        lng: '',
        roleIds: [],
        password: ''
    }
}

const station_id = ref<number | null>(null)
const formModel = reactive<AccountFormModel>(createDefaultFormModel())

// function validatorNumberValueType(rule: FormItemRule, value: number): boolean {
//   return value === null || undefined ? false : true;
// }

// function validatorUsername(rule: FormItemRule, value: string) {
//   const regRex =
//     /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/;
//   if (!value) {
//     return new Error("请填写社会信用代码");
//   } else if (!regRex.test(value)) {
//     return new Error("社会信用代码格式不正确");
//   } else if (value.length !== 18) {
//     return new Error("社会信用代码长度应为18位");
//   } else {
//     return true;
//   }
// }

const rules: Record<keyof AccountRules, FormItemRule | FormItemRule[]> = {
    name: { required: true, message: '请填写用户名称', trigger: 'blur' },
    username: {
        required: true,
        message: '请填写账号名称',
        trigger: ['input', 'blur']
    },
    password: [
        {
            required: true,
            message: '请填写密码',
            trigger: ['input', 'blur']
        },
        {
            min: 8,
            max: 20,
            message: '密码长度需为8-20个字符',
            trigger: ['input', 'blur']
        },
        {
            validator: (rule, value) => {
                return new Promise((resolve, reject) => {
                    const regex =
                        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/
                    if (!regex.test(value)) {
                        reject(
                            new Error('密码需包含字母、数字和特殊字符的组合')
                        )
                    } else {
                        resolve()
                    }
                })
            },
            trigger: ['input', 'blur']
        }
    ],
    roleIds: {
        required: true,
        message: '请选择角色',
        trigger: 'blur',
        validator: (rule, value) => {
            // 校验是否是数组
            if (!Array.isArray(value)) {
                return new Error('角色ID必须是一个数组')
            }

            // 校验数组是否为空
            if (value.length === 0) {
                return new Error('请至少选择一个角色')
            }

            // 校验通过
            return true // 返回 true 表示通过校验
        }
    },
    status: {
        required: true,
        message: '请选择账号状态',
        trigger: 'blur'
    }
}

function handleUpdateFormModel(model: Partial<AccountFormModel>) {
    Object.assign(formModel, model)
}

function handleUpdateFormModelByModalType() {
    const handlers: Record<ModalType, () => void> = {
        add: () => {
            const defaultFormModel = createDefaultFormModel()
            station_id.value = null
            handleUpdateFormModel(defaultFormModel)
        },
        edit: () => {
            if (props.editData) {
                const { id, roleIds, ...editData } = props.editData
                const roleIdsArray = roleIds.split(',')

                station_id.value = id
                handleUpdateFormModel({
                    ...editData,
                    roleIds: roleIdsArray
                })
            }
        }
    }

    handlers[props.type]()
}
const captchaKey = ref('')
function handleSubmit() {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            const crypto_aes = new CryptoAES(captchaKey.value)

            if (Array.isArray(formModel.roleIds)) {
                formModel.roleIds = formModel.roleIds.join(',')
            }

            const { password, ...otherFormData } = formModel
            if (props.type === 'add') {
                await store.saveData({
                    ...otherFormData,
                    password: crypto_aes.encrypt(formModel.password.trim()),
                    key: captchaKey.value
                })
            } else {
                // TODO 需要后端拦截修改登录账号
                await store.editData({
                    ...otherFormData,
                    id: station_id.value
                })
            }
            await closeModal()
            // 清空表单内容和校验状态
            formRef.value?.restoreValidation()
            // 重置表单模型为默认值
            handleUpdateFormModel(createDefaultFormModel())
        } else {
            console.log(errors)
            message.error('验证失败')
        }
    })
}

async function getKey() {
    const res = await store.getPassKey()
    if (res) {
        captchaKey.value = res
    }
}

watch(
    () => props.visible,
    (newValue) => {
        if (newValue) {
            getKey()
            handleUpdateFormModelByModalType()
        }
    }
)
</script>
