import { post, get } from '@/utils/request'
import type { VersionListItem, PackageForm, VersionListRequest } from './types'

// 导入DeviceListRequest类型

enum Api {
    // package list
    PackageList = '/deviceUrl/list',
    // URL of the device firmware package
    CreatePackage = '/deviceUrl/add',
    // URL of the device firmware package with update
    UpdatePackage = '/deviceUrl/edit',
    // URL of the device firmware package with delete
    DeletePackage = '/deviceUrl/remove'
}

// fetchVersionList，用于获取设备列表
export function fetchPackageList(data: VersionListRequest) {
    return post<ResponseDataList<VersionListItem>>({
        // 请求地址
        url: Api.PackageList,
        // 请求参数
        data
    })
}

// fetchDeviceWithInsert, 用于新增加油机设备信息
export function fetchPackageWithCreate(data: Omit<PackageForm, 'id'>) {
    return post<ResponseData<any>>({
        url: Api.CreatePackage,
        data
    })
}

// fetchDeviceWithUpdate, 用于编辑加油机设备信息
export function fetchPackageWithUpdate(data: PackageForm) {
    return post<ResponseData<any>>({
        url: Api.UpdatePackage,
        data
    })
}

// fetchVersionWithDelete, 用于删除加油机设备信息
export function deletePackageById(id: number | string) {
    return post<ResponseData<any>>({
        url: Api.DeletePackage,
        data: { id }
    })
}
