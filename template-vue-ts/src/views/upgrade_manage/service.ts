import { post } from '@/utils/request'
import type { UpgradeManageItem, UpgradeManageRequest } from './types'

// 导入DeviceListRequest类型

enum Api {
    // device list
    // UpgradeDeviceList = "device/list",
    UpgradeDeviceList = 'device/firmwareVerList ',
    UpgradeDeviceUrl = 'device/getDeviceUrl'
}

export function fetchUpgradeDeviceList(
    params: UpgradeManageRequest
): Promise<ResponseDataList<UpgradeManageItem>> {
    return post<ResponseDataList<UpgradeManageItem>>({
        url: Api.UpgradeDeviceList,
        data: params
    })
}
// 查询固件包版本集合
export function fetchUpgradeDeviceUrl(
    type: string
): Promise<ResponseDataList<UpgradeManageItem>> {
    const params: UpgradeManageRequest = { type }
    return post<ResponseDataList<UpgradeManageItem>>({
        url: Api.UpgradeDeviceUrl,
        data: params,
        headers: { 'Content-Type': 'application/json' }
    })
}
