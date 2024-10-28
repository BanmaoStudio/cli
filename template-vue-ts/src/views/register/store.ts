import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import {
    registerDevice,
    registerFirst,
    fetchStationDataByDeviceSN,
    fetchDeviceDataByDeviceSN,
    fetchIsRegistered,
    searchDeviceId,
    siteListId,
    fetchSiteInfoById,
    deviceSnList
} from './service'
import {
    DeviceInfo,
    FuelStation,
    DeviceParams,
    RegisterDeviceData
} from './types'
import { fetchFactoryList, fetchFuelStationTypeList } from '@/services'

export const useRegisterMachineStore = defineStore('register-store', () => {
    const machineFactoryOptions = ref<any[]>([])
    const stationGroupOptions = ref<any[]>([])

    const siteId = ref<number>(0)

    const formData = reactive<RegisterDeviceData>({
        isFirst: '0',
        deviceInfo: {
            tankerName: '',
            factoryName: '',
            factoryNum: '',
            factoryTime: null,
            gunBindingList: [],
            gunNum: 0,
            id: 0,
            linkGunOff: '1',
            linkPulse: '1',
            skDeviceSn: ''
        },
        fuelSite: {
            name: '',
            creditCode: '',
            province: '',
            city: '',
            county: '',
            telephone: '',
            groupId: 1,
            lng: '',
            lat: '',
            address: ''
        },
        skDeviceSn: '',
        oldSkDeviceSn: ''
    })

    const skDeviceSn = computed(() => formData.skDeviceSn)

    function resetFormData() {
        formData.isFirst = '0'
        formData.deviceInfo = {
            tankerName: '',
            factoryName: '',
            factoryNum: '',
            factoryTime: null,
            gunBindingList: [],
            gunNum: 0,
            id: 0,
            linkGunOff: '1',
            linkPulse: '1',
            skDeviceSn: ''
        }
        formData.fuelSite = {
            name: '',
            creditCode: '',
            province: '',
            city: '',
            county: '',
            telephone: '',
            groupId: 1,
            lng: '',
            lat: '',
            address: ''
        }
        formData.skDeviceSn = ''
        formData.oldSkDeviceSn = ''
    }

    const isFirstType = (isFirst: string) => {
        formData.isFirst = isFirst
    }
    const setSkDeviceSN = (skDeviceSn: string) => {
        formData.skDeviceSn = skDeviceSn
    }
    const setOldSkDeviceSN = (oldSkDeviceSn: string) => {
        formData.oldSkDeviceSn = oldSkDeviceSn
    }

    /**
     * 存储加油站信息
     * @param data - 加油站信息
     */
    const setStationFormData = (data: FuelStation) => {
        formData.fuelSite = data
        if (data.id) {
            siteId.value = data.id as number
        }
    }

    const getStationFormData = async () => {
        try {
            const skDeviceSn = formData.oldSkDeviceSn as string
            const result = await fetchStationDataByDeviceSN(skDeviceSn)
            if (result) {
                const { data } = result
                setStationFormData(data[0])
            } else {
                throw new Error('result 不存在')
            }
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    /**
     * 存储加油机信息
     * @param data - 加油机信息
     */
    const setMachineFormData = (data: DeviceInfo) => {
        formData.deviceInfo = data
    }

    const getMachineFormData = () => {
        return formData.deviceInfo
    }

    const getMachineFormDataByRemote = async (params?: DeviceParams) => {
        try {
            const result = await fetchDeviceDataByDeviceSN(params)
            if (result) {
                const { data } = result
                setMachineFormData(data[0])
            }
            return result
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    /**
     * 重新注册加油机信息
     */
    async function register(payload) {
        try {
            // console.log(
            //     '%cstore.ts line:105 formData',
            //     'color: #007acc;',
            //     payload
            // )
            const { status, data } = await registerDevice(payload)
            if (status === 0) {
                resetFormData()
                return {
                    stationName: formData.fuelSite.name,
                    ...data
                }
            } else {
                return null
            }
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }
    /**
     * 首次注册加油机信息
     */
    async function firstRegister(registerData) {
        try {
            const { status, data } = await registerFirst(registerData)
            if (status === 0) {
                resetFormData()
                return {
                    stationName: formData.fuelSite.name,
                    ...data
                }
            } else {
                return null
            }
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    async function getMachineFactoryList() {
        try {
            const result = await fetchFactoryList()
            if (result) {
                machineFactoryOptions.value = result.data.map((item: any) => {
                    return { label: item.name, value: item.id.toString() }
                })
            }
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    async function getFuelStationTypeList() {
        try {
            const result = await fetchFuelStationTypeList()
            if (result) {
                stationGroupOptions.value = result.data.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.id,
                        disabled: Boolean(item.status)
                    }
                })
            }
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    async function getIsRegistered(skDeviceSn: string) {
        try {
            const result = await fetchIsRegistered(skDeviceSn)
            if (result && result.status === 0) {
                return 'ok'
            } else {
                return result.msg
            }
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }
    // 查询加油机
    async function getDeviceInfo(skDeviceSn: string) {
        if (skDeviceSn) {
            try {
                const { data } = await searchDeviceId(skDeviceSn)
                return data
            } catch (error) {
                window.$message?.error('服务器错误')
                throw new Error('Invalid: ' + error)
            }
        }
    }
    // 查询所属加油站信息
    async function getSiteListId(skDeviceSn: string) {
        if (skDeviceSn) {
            try {
                const { data } = await siteListId(skDeviceSn)
                return data
            } catch (error) {
                window.$message?.error('服务器错误')
                throw new Error('Invalid: ' + error)
            }
        }
    }

    async function getSiteInfoById(siteId: string) {
      if (!siteId) {
        return null
      }
      try {
        const {status, msg, data} = await fetchSiteInfoById(siteId)
        if (status === 0) {
          return data
        } else {
          window.$message?.error(msg)
          return null;
        }
      } catch (error) {
        window.$message?.error('服务器错误');
        throw new Error('Invalid: ' + error)
      }
    }
    // 获取设备编码下拉数据
    async function getDeviceSnList(
        skDeviceSn: string | null,
        status: string | null
    ) {
        try {
            const { data } = await deviceSnList(skDeviceSn, status)
            return data
        } catch (error) {
            window.$message?.error('服务器错误')
            throw new Error('Invalid: ' + error)
        }
    }

    return {
        formData,
        siteId,
        skDeviceSn,
        resetFormData,
        register,
        firstRegister,
        isFirstType,
        setSkDeviceSN,
        setOldSkDeviceSN,
        setStationFormData,
        getStationFormData,
        setMachineFormData,
        getMachineFormData,
        getMachineFormDataByRemote,
        machineFactoryOptions,
        getMachineFactoryList,
        stationGroupOptions,
        getFuelStationTypeList,
        getIsRegistered,
        // 查询加油机
        getDeviceInfo,
        //所属加油站信息
        getSiteListId,
        // 获取设备编码下拉数据
        getDeviceSnList,
        // 获取油站信息
        getSiteInfoById
    }
})
