<template>
    <n-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        size="large"
        :show-require-mark="false"
    >
        <n-form-item label="账号" path="username">
            <n-input v-model:value="loginForm.username" placeholder="用户名">
                <template #prefix>
                    <icon-ant-design-user-outlined />
                </template>
            </n-input>
        </n-form-item>
        <n-form-item label="密码" path="password">
            <n-input
                v-model:value="loginForm.password"
                show-password-on="mousedown"
                type="password"
                placeholder="密码"
            >
                <template #prefix>
                    <icon-ant-design-lock-outlined />
                </template>
            </n-input>
        </n-form-item>
        <n-form-item label="验证码" path="captcha">
            <div class="flex-y-center w-100">
                <n-input
                    v-model:value="loginForm.captcha"
                    placeholder="验证码"
                    style="width: 100%"
                    @keyup.enter="handleLogin"
                    ref="captchaRef"
                    maxlength="4"
                >
                    <template #prefix>
                        <icon-icon-park-outline-safe-retrieval />
                    </template>
                </n-input>
                <n-image
                    class="h-40px ml-16px cursor-pointer border-1px border-[#eee]"
                    width="120"
                    :src="captchaData.img"
                    preview-disabled
                    @click="handleRefreshCaptcha"
                />
            </div>
        </n-form-item>
        <n-form-item>
            <n-button
                type="primary"
                :loading="loading"
                size="large"
                block
                @click="handleLogin"
                >登录</n-button
            >
        </n-form-item>
    </n-form>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { useAuthStore } from '@/store'
import { CryptoAES } from '@/utils/crypto'

interface LoginFormProp {
    username: string
    password: string
    captcha: string
    captchaKey?: string
}

const message = useMessage()
const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInst | null>(null)
const loginForm = ref<LoginFormProp>({
    username: '',
    password: '',
    captcha: ''
})

// function validateAndEncrypt(rule: any, value: string): boolean | Error {
//   // console.log(rule)
//   /** 管理员账号可以不用校验 */
//   if (rule.field === 'username' && value === 'admin') {
//     return true;
//   }
//   if (value.length < 6 || value.length > 20) {
//     return new Error('长度应为6到20位')
//   } else {
//     return true;
//   }
// }

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 20, message: '长度应为5到20位', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度应为6到20位', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { length: 4, message: '长度应为4位', trigger: 'blur' }
    ]
}

interface CaptchaProps {
    /** captchaKey 验证码的查询ID */
    captchaKey?: string
    /** img 验证码图片 */
    img: string
    key: string
}

const captchaRef = ref()
const captchaData = ref<CaptchaProps>({
    captchaKey: '',
    img: '',
    key: ''
})

const handleCaptcha = async () => {
    try {
        const res = await authStore.getCaptcha()
        if (res) {
            const { imgBase64, ...other } = res
            captchaData.value = {
                ...captchaData.value,
                ...other,
                img: imgBase64
            }
        }
    } catch (error) {}
}

const handleRefreshCaptcha = useDebounceFn(() => {
    handleCaptcha()
}, 500)

const loading = ref<boolean>(false)

const handleSubmit = () => {
    loading.value = true
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            const crypto_aes = new CryptoAES(captchaData.value.key)
            const res = await authStore.login({
                username: crypto_aes.encrypt(loginForm.value.username.trim()),
                password: crypto_aes.encrypt(loginForm.value.password.trim()),
                verifyCode: loginForm.value.captcha,
                key: captchaData.value.key // AES 加解密key
                // captchaKey: captchaData.value.captchaKey,
            })
            if (res === 'ok') {
                router.push('/')
            } else if (res === 'bad') {
                loading.value = false
                handleCaptcha()
                captchaRef.value.handleClear()
            }
        } else {
            console.log(errors)
            message.error('Invalid')
        }
        loading.value = false
    })
}

const handleLogin = useDebounceFn(handleSubmit, 500)

onMounted(() => {
    handleCaptcha()

    window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin()
        }
    })
    // document.onkeydown = function(e: KeyboardEvent) {
    //   console.log(e)
    // }
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin()
        }
    })
})
</script>
