import { post } from '@/utils/request'
import type { IotCardData } from './types'

enum Api {
    // URL of the fuel station list
    // 加油机列表
    GetByIccIdList = '/iot/getByIccId'
}

export function fetchGetByIccIdList(data: { IccId: string }) {
    return post<ResponseData<IotCardData>>({
        url: Api.GetByIccIdList,
        data
    })
}
