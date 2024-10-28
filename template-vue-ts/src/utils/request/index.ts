import axios from 'axios'
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig
} from 'axios'
import { showMessage } from './status'
import { IResponse } from './type'
import { getToken } from '@/utils'
import { EnumResponseCode } from '@/enums'
import router from '@/router'

const controller = new AbortController()

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 60 * 1000
})

const TokenPrefix = 'Bearer'

// axios 实例拦截请求
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `${TokenPrefix} ${token}`
        }
        config.signal = controller.signal
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// axios 实例拦截响应
service.interceptors.response.use(
    async (response: AxiosResponse) => {
        if (response.status === 200) {
            // 优先判断当是否为导出接口
            if (response.config?.responseType === 'blob') {
                // 处理下载 Excel 文件
                const fileName = decodeURIComponent(
                    response.headers['content-disposition'].split(
                        /[\"](.*)[\"]/
                    )[1]
                )
                return {
                    ...response,
                    data: {
                        data: response.data,
                        fileName
                    }
                }
            }
            if (
                response.data &&
                (response.data.status === EnumResponseCode.SUCCESS ||
                    response.data.status === 200)
            ) {
                return {
                    ...response,
                    data: {
                        status: response.data.status,
                        data: response.data.data,
                        msg: response.data.msg
                    }
                }
            } else if (response.data.status === 202) {
                window.$notification?.error({
                    content: response.data.msg || '登录信息已过期',
                    duration: 5000
                })
                await controller.abort()
                await router.replace('/login')
            } else {
                window.$notification?.error({
                    content: response.data.msg || '出现错误啦！请稍后再试。',
                    duration: 5000
                })
            }
        } else {
            showMessage(response.status)
        }
        return response
    },
    (error: AxiosError) => {
        const { response } = error
        if (response) {
            // 请求已发出，但是不在2xx的范围
            showMessage(response.status)
            return Promise.reject(response?.data)
        }
    }
)

const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
    const conf = config
    return new Promise((resolve, reject) => {
        service
            .request<any, AxiosResponse<IResponse>>(conf)
            .then((res: AxiosResponse<IResponse>) => {
                if (res && Object.keys(res.data).length > 0) {
                    const { data } = res
                    resolve(data as T)
                } else {
                    window.$notification?.error({
                        content: '服务器错误',
                        duration: 5000
                    })
                    reject(new Error('服务器错误'))
                }
            })
            .catch((err: any) => {
                showMessage('服务器错误')
                reject(err)
            })
    })
}

export function get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'GET' })
}

export function post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'POST' })
}

export default request

export type { AxiosInstance, AxiosResponse }
