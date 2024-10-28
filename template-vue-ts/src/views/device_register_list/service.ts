import { post } from '@/utils/request'
import type { DeviceRegisterItem, DeviceRegisterRequest } from './types'

// 导入DeviceListRequest类型

enum Api {
    // device list
    DeviceList = 'device/history/list',
    // 通过 id 获取设备项
    RefreshDevice = '/device/history/renew',
    // 加油机注册历史详情
    HistoryDetails = '/device/history/getById'
}

// fetchDeviceList，用于获取设备列表
export function fetchDeviceRegisterList(data: DeviceRegisterRequest) {
    return post<ResponseDataList<DeviceRegisterItem>>({
        // 请求地址
        url: Api.DeviceList,
        // 请求参数
        data
    })
}

/**
 * Query the data of fuel dispenser collector device
 * @param id - fuel dispenser collector device history data id
 * @returns
 */
export function fetchDeviceById(id: number) {
    return post<ResponseData<DeviceRegisterItem>>({
        url: Api.RefreshDevice,
        data: {
            id
        }
    })
}
// 加油机注册历史详情
export function historyDetailsId(id: number) {
    return post<ResponseData<DeviceRegisterItem>>({
        url: Api.HistoryDetails,
        data: {
            id
        }
    })
}
