import { get, post } from '@/utils/request'
import type { AreaCodeItem } from './types'

enum Api {
    /** 获取区域联动 */
    AreaCode = '/regisCommon/area',
    /** 全部区域查询 */
    AreaCodeList = '/regisCommon/allArea',
    /** 获取账号下级区域 Account */
    AreaList = '/user/getArea',
    /** 获取全部加油站列表 */
    FuelStationList = '/regisCommon/siteList',
    /** 获取全部加油站列表(液位数据 报表中心) */
    FuelSiteList = '/regisCommon/meterSiteList',
    /** 加油站类别列表 */
    FuelStationTypeList = '/regisCommon/siteGroup',
    /** 厂家列表 */
    FactoryList = '/regisCommon/factory',
    /** 油品 */
    OilList = '/common/getOilList',
    /** 获取用户权限菜单 */
    UserMenuList = '/menus/getMeterRuleList'
}

/**
 * 获取获取用户权限菜单
 */
export function fetchUserMenuList() {
    return post<ResponseData<any>>({
        url: Api.UserMenuList
    })
}
export function fetchAllAreaCode() {
    return post<ResponseData<any>>({
        url: Api.AreaCodeList
    })
}

/**
 * 获取下级地区编码 API
 * @param pid
 */
export function fetchAreaCode(pid?: string | number) {
    return post<ResponseData<AreaCodeItem[]>>({
        url: Api.AreaCode,
        data: {
            pid
        }
    })
}

/**
 * 获取加油站列表
 */
export function fetchFuelStationList() {
    return get<ResponseData<{ id: number; name: string }[]>>({
        url: Api.FuelStationList
    })
}
/**
 * 获取加油站列表(液位数据、报表中心)
 */
export function fetchFuelSiteList() {
    return get<ResponseData<{ id: number; name: string }[]>>({
        url: Api.FuelSiteList
    })
}

/**
 * 获取加油站类别列表
 */
export function fetchFuelStationTypeList() {
    return get<ResponseData<any[]>>({
        url: Api.FuelStationTypeList
    })
}

/**
 * 获取设备厂家列表
 */
export function fetchFactoryList() {
    return get<ResponseData<any[]>>({
        url: Api.FactoryList
    })
}

/**
 * 获取账号管理表单的下级区域
 */
export function fetchAreaList() {
    return post<ResponseData<any>>({
        url: Api.AreaList
    })
}
/**
 * 获取所有油品
 */
export function fetchOilList() {
    return post<ResponseData<any>>({
        url: Api.OilList
    })
}
