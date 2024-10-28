import { post } from '@/utils/request'
import {
    DeviceInfo,
    FuelStation,
    DeviceParams,
    RegisterDeviceData,
    RegisterResultData
} from './types'

enum Api {
    /** register device info of API's URL */
    RegisterFist = 'register/registerDevice',
    RegisterDevice = 'register/registerDeviceRepeat',
    /** get the fuel station information of API's URL  */
    GetStationData = 'register/getSiteList',
    /** get the device information of API's URL */
    GetDeviceData = 'register/getDeviceInfo',
    /** URL of whether the device has been registered */
    IsRegistered = 'register/getRegis',
    // 查询加油机
    GetDeviceInfo = '/register/getDeviceInfo',
    // 所属加油站信息
    GetSiteInfo = '/register/getSiteList',
    // 获取设备编码下拉数据
    GetDeviceSnList = '/register/getDeviceSnList'
}

/**
 * fetch station information by device SN
 * @param skDeviceSn - the register device of serial number
 * @returns - Promise<any>
 */
export const fetchStationDataByDeviceSN = async (skDeviceSn: string) =>
    post<ResponseData<FuelStation>>({
        url: Api.GetStationData,
        params: {
            skDeviceSn
        }
    })

/**
 * fetch device information by device SN
 * @param data - device serial number
 * @returns
 */
export const fetchDeviceDataByDeviceSN = async (data?: DeviceParams) =>
    post<ResponseData<DeviceInfo>>({
        url: Api.GetDeviceData,
        data
    })

/**
 * register machine data
 * @param data - request form data
 */
export const registerDevice = async (data: RegisterDeviceData) => {
    return post<ResponseData<RegisterResultData>>({
        url: Api.RegisterDevice,
        data
    })
}
// 首次注册
export const registerFirst = async (data: RegisterDeviceData) => {
    return post<ResponseData<RegisterResultData>>({
        url: Api.RegisterFist,
        data
    })
}

/**
 * whether the device has been registered
 * @param skDeviceSn - device serial number
 */
export const fetchIsRegistered = async (skDeviceSn: string) =>
    post<ResponseData<string>>({
        url: Api.IsRegistered,
        data: {
            skDeviceSn
        }
    })
// 查询加油机
export function searchDeviceId(skDeviceSn: string) {
    return post<ResponseData<string>>({
        url: Api.GetDeviceInfo,
        data: {
            skDeviceSn
        }
    })
}
// 查询所属加油站信息
export function siteListId(skDeviceSn: string) {
    return post<ResponseData<string>>({
        url: Api.GetSiteInfo,
        data: {
            skDeviceSn
        }
    })
}

/**
 * 根据加油站ID 获取加油站信息
 * @param id - 加油站id
 */
export function fetchSiteInfoById(id: string) {
    return post<ResponseData<any>>({
        url: Api.GetSiteInfo,
        data: {
            siteId: id
        }
    })
}

// 获取设备编码下拉数据
export function deviceSnList(skDeviceSn: string | null, status: string | null) {
    return post<ResponseData<string>>({
        url: Api.GetDeviceSnList,
        data: {
            skDeviceSn,
            status
        }
    })
}
