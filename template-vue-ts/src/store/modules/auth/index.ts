import { LoginRequestProps, LoginResponse } from '@/services/auth/types'
import { unref } from 'vue'
import { localStg } from '@/utils/storage'
import { router } from '@/router'
import { useRouteStore, useTabStore, useCommonStore } from '@/store'
import { defineStore } from 'pinia'
import { useRouterPush } from '@/hooks'
import { clearAuthStorage, getToken, getUserInfo } from './helpers'

import { fetchLogin, fetchCaptcha } from '@/services'
import { EnumResponseCode } from '@/enums'
import { Auth } from '#/business'

interface AuthState {
    /** 用户信息 */
    userInfo: Auth.UserInfo
    /** 用户 token */
    token: string
    /** 登录的加载状态 */
    loginLoading: boolean
    /** 验证码 Key */
    captchaKey: string
}

export const useAuthStore = defineStore('auth-store', {
    state: (): AuthState => ({
        userInfo: getUserInfo(),
        token: getToken(),
        loginLoading: false,
        captchaKey: ''
    }),
    getters: {
        isLogin(state) {
            return Boolean(state.token)
        },
        username(state) {
            return state.userInfo.name || state.userInfo.username
        },
        loginTime(state) {
            return state.userInfo.loginTime
        },
        watermark(state) {
            return `${state.userInfo.username} ${state.userInfo.loginIp} at ${state.userInfo.loginTime}`
        },
        areaCode(state) {
            return state.userInfo.areaCode
        }
    },
    actions: {
        /** 登录请求 */
        async login(formData: LoginRequestProps) {
            this.loginLoading = true
            try {
                const { data, status } = await fetchLogin({
                    ...formData,
                    captchaKey: this.captchaKey
                })
                if (status === EnumResponseCode.SUCCESS) {
                    const { token, ...userInfo } = data
                    localStg.set('token', token)
                    localStg.set('userInfo', { ...userInfo, userRole: 'user' })
                    this.$patch({
                        userInfo: userInfo,
                        token: token
                    })
                    return 'ok'
                } else {
                    return 'bad'
                }
            } catch (error) {
                throw new Error(error as string)
            } finally {
                this.loginLoading = false
            }
        },
        /** 获取验证码 */
        async getCaptcha() {
            try {
                const { status, data } = await fetchCaptcha()
                if (status === EnumResponseCode.SUCCESS || 200) {
                    const { captchaKey } = data
                    this.captchaKey = captchaKey
                    return data
                } else {
                    return null
                }
            } catch (error) {
                console.error(error)
            }
        },
        /** 重置 auth 状态 */
        resetAuthStore() {
            const { toLogin } = useRouterPush(false)
            const { resetTabStore } = useTabStore()
            const { resetRouteStore } = useRouteStore()
            const { resetGasStationStore } = useCommonStore()
            const route = unref(router.currentRoute)

            clearAuthStorage()
            // this.$reset();

            // if (route.meta.requiresAuth) {
            toLogin()
            // }

            nextTick(() => {
                resetTabStore()
                resetRouteStore()
                resetGasStationStore()
            })
        }
    }
})
