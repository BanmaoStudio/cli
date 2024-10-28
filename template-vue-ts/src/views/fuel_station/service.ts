import { post } from '@/utils/request'
import type {
    FuelStationForm,
    FuelStationItem,
    FuelStationParams
} from './types'

enum Api {
    // URL of the fuel station list
    // 加油机列表
    FuelStationList = '/site/list',
    // 新增加油站
    AddFuelStation = '/site/add',
    // 修改加油站
    EditFuelStation = '/site/edit',
    DeleteFuelStation = '/site/delete',
    /** 判断名称是否存在 */
    CheckName = '/site/nameHave'
}

/**
 * Query fuel station list
 * @param data - request filter params with fuel station
 * @returns Promise<ResponseDataList<FuelStationItem[]>>
 */
export function fetchFuelStationList(data: FuelStationParams) {
    return post<ResponseDataList<FuelStationItem>>({
        url: Api.FuelStationList,
        data
    })
}

/**
 * Add fuel Station data
 * @param data - fuel station form data
 */
export function fetchAddFuelStation(data: FuelStationForm) {
    return post<ResponseData<null>>({
        url: Api.AddFuelStation,
        data
    })
}

export function fetchEditFuelStation(data: FuelStationForm) {
    return post<ResponseData<null>>({
        url: Api.EditFuelStation,
        data
    })
}

export function fetchDeleteFuelStation(id: number) {
    return post<ResponseData<null>>({
        url: Api.DeleteFuelStation,
        data: {
            id
        }
    })
}
export function fetchCheckName(name: string) {
    return post({
        url: Api.CheckName,
        data: {
            name
        }
    })
}
