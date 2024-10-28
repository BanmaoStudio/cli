import { EnumResponseCode } from '@/enums/responseCode'
import {
    fetchAreaCode,
    fetchFuelStationList,
    fetchFuelStationTypeList,
    fetchFactoryList,
    fetchAreaList,
    fetchUserMenuList
} from '@/services'
import { defineStore } from 'pinia'
import type { SelectGroupOption, SelectOption } from 'naive-ui'
import { AreaCodeItem } from '@/services/common/types'

interface CommonState {
    /** 集团类型列表 */
    fuelStationTypeList: SelectOption[]
    /** 全部加油站列表 */
    fuelStationList: SelectOption[]
    /** 设备厂家列表 */
    factoryList: SelectOption[]
    /** 油品类型 */
    oilTypeList: SelectGroupOption[] | SelectOption[]
    /** 加油站企业注册类型 */
    registerTypeList: SelectOption[]
    oilColorList: Map<string, string>
    /** 账号管理下的区域 */
    areaList: any[]
    /** 菜单列表 */
    menuList: []
}

export const useCommonStore = defineStore('common-state', {
    state: (): CommonState => ({
        fuelStationTypeList: [],
        fuelStationList: [],
        factoryList: [],
        registerTypeList: [],
        areaList: [],
        menuList: [],
        oilTypeList: [
            {
                type: 'group',
                label: '汽油',
                key: 'portal',
                children: [
                    { label: '92#', value: '92#' },
                    { label: '95#', value: '95#' },
                    { label: '98#', value: '98#' }
                ]
            },
            {
                type: 'group',
                label: '柴油',
                key: 'diesel',
                children: [
                    { label: '0#', value: '0#' },
                    { label: '-10#', value: '-10#' },
                    { label: '-20#', value: '-20#' },
                    { label: '-35#', value: '-35#' }
                ]
            }
        ],
        oilColorList: new Map([
            ['92#', '#F44336'],
            ['95#', '#4CAF50'],
            ['98#', '#FF9800'],
            ['0#', '#9C27B0'],
            ['-10#', '#03A9F4'],
            ['-20#', '#FF5722'],
            ['-35#', '#A6EB19']
        ])
    }),
    actions: {
        async getFuelStationList() {
            try {
                const { data, msg, status } = await fetchFuelStationList()
                if (status === EnumResponseCode.SUCCESS) {
                    data.forEach((item: { name: string; id: number }) => {
                        this.fuelStationList.push({
                            label: item.name,
                            value: item.id
                        })
                    })
                } else {
                    this.fuelStationList = []
                }
            } catch (error) {
                throw new Error(error as string)
            }
        },
        async getFuelStationTypeList() {
            try {
                const { data, msg, status } = await fetchFuelStationTypeList()
                if (status === EnumResponseCode.SUCCESS) {
                    data.forEach((item: { name: string; id: number }) => {
                        this.fuelStationTypeList.push({
                            label: item.name,
                            value: item.id
                        })
                    })
                } else {
                    window.$message?.warning(msg)
                }
            } catch (error) {
                throw new Error(error as string)
            }
        },
        /**
         * 获取设备厂家列表
         */
        async getFactoryList() {
            try {
                const { data, status: code } = await fetchFactoryList()
                if (code === EnumResponseCode.Normal_SUCCESS) {
                    this.factoryList = []
                    this.registerTypeList = []
                    data.forEach(
                        (item: { name: string; id: number; type: number }) => {
                            if (item.type === 1) {
                                this.factoryList.push({
                                    label: item.name,
                                    value: item.name
                                })
                            } else if (item.type === 2) {
                                this.registerTypeList.push({
                                    label: item.name,
                                    value: item.name
                                })
                            }
                        }
                    )
                }
            } catch (error) {
                throw new Error(error as string)
            }
        },
        async getAreaList(areaCode?: string | number) {
            try {
                const { data, status: code } = await fetchAreaCode(areaCode)
                if (code === EnumResponseCode.SUCCESS) {
                    // data.forEach((item: any) => {
                    //   this.areaList.push({
                    //     label: item.name,
                    //     value: item.code,
                    //   });
                    // });
                    this.areaList = [...data]
                    return data
                }
                return []
            } catch (error) {
                throw new Error(error as string)
            }
        },
        async getAreaListByAccount() {
            try {
                const result = await fetchAreaList()
                if (
                    result &&
                    result.status === EnumResponseCode.Normal_SUCCESS
                ) {
                    if (result.data.length > 0) {
                        const data = result.data.map((item: AreaCodeItem) => ({
                            label: item.name,
                            value: Number(item.code)
                        }))
                        this.areaList = [...new Set(data)] as SelectOption[]
                        // areaList.value.push(...new Set(result.data.map((item: AreaCodeItem) => ({
                        //   label: item.name,
                        //   value: Number(item.code)
                        // }))))
                    }
                }
            } catch (error) {}
        },

        /** 获取菜单栏 */
        async getMenuList() {
            try {
                const { data, status } = await fetchUserMenuList()

                if (status === 0) {
                    this.menuList = data
                }
                return data
            } catch (error) {
                throw new Error(error as string)
            }
        },
        resetGasStationStore() {
            this.fuelStationList = []
            this.areaList = []
        }
    }
})
