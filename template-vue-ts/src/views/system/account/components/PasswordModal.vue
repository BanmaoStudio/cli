<template>
    <n-modal
        v-model:show="modalVisible"
        preset="card"
        title="重置密码"
        class="w-500px lt-sm:w-full"
    >
        <n-form
            ref="formRef"
            label-placement="top"
            :label-width="120"
            :model="formModel"
            :rules="rules"
            :show-require-mark="false"
        >
            <n-form-item label="请输入新密码" path="password">
                <n-input v-model:value="formModel.password" />
            </n-form-item>

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
import { useAccountStore } from '../store'
import { useDeviceScreen } from '@/hooks'
import { CryptoAES } from '@/utils/crypto'
import type { FormInst, FormItemRule } from 'naive-ui'

export interface Props {
    /** 弹窗可见性 */
    passVisible: boolean
    id: number | null
}

defineOptions({ name: 'PasswordModel' })

const store = useAccountStore()
const message = useMessage()
const { isMobile } = useDeviceScreen()

const props = withDefaults(defineProps<Props>(), {
    passVisible: false,
    id: null
})

interface Emits {
    (e: 'update:passVisible', passVisible: boolean): void
}

const emit = defineEmits<Emits>()

const modalVisible = computed({
    get() {
        return props.passVisible
    },
    set(passVisible) {
        emit('update:passVisible', passVisible)
    }
})

const closeModal = () => {
    modalVisible.value = false
}

const formRef = ref<HTMLElement & FormInst>()

const formModel = reactive({
    password: ''
})

const rules = {
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
    ]
}

const captchaKey = ref('')
function handleSubmit() {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            const crypto_aes = new CryptoAES(captchaKey.value)
            const res = await store.resetPassword({
                id: props.id,
                password: crypto_aes.encrypt(formModel.password.trim()),
                key: captchaKey.value
            })
            // 清空表单内容和校验状态
            formRef.value?.restoreValidation()
            formModel.password = ''
            message.success('设置成功')
            await closeModal()
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
    () => props.passVisible,
    (newValue) => {
        if (newValue) {
            getKey()
        }
    }
)
</script>
