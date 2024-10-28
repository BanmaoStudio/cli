import { post, get } from '@/utils/request'
import { RegisterDeviceItem, RegisterDeviceListRequest } from './types'

enum Api {
    // device list
    DeviceList = 'device/list',
    // URL of the firmware package version list
    PackageList = '/device/getDeviceUrl',
    // URL of the device firmware package
    UpgradeDevice = '/device/updateUrl',
    // 通过 id 获取设备项
    RefreshDevice = '/device/info/',
    // 导出
    ExportDevice = '/device/export',
    // 重置设备信息
    ResetDevice = '/register/resetDevice'
}

// fetchDeviceList，用于获取设备列表
export function fetchDeviceList(data: RegisterDeviceListRequest) {
    return post<ResponseDataList<RegisterDeviceItem>>({
        // 请求地址
        url: Api.DeviceList,
        // 请求参数
        data
    })
}
export function fetchExportDevice(data: RegisterDeviceListRequest) {
    return post({
        url: Api.ExportDevice,
        responseType: 'blob',
        data
    })
}

// 重置设备信息
export function fetchResetDevice(skDeviceSn: string) {
    return post<ResponseData<null>>({
        url: Api.ResetDevice,
        data: {
            skDeviceSn
        }
    })
}
