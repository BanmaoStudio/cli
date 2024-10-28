import { Ref } from 'vue'

export interface OptionsType<T = any> {
    requestError?: () => void
    requestSuccess?: () => void
    callback?: (data: any) => CallbackResult
    filterOption?: Ref<T>
    exportRequestFn?: (...args: any) => Promise<any>
}

export interface CallbackResult {
    list: any[]
    total: number
    pageSize: number
    pageNum: number
}
