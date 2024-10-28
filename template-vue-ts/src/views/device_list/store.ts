import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchDeviceList, fetchResetDevice } from './service'
import type {
    RegisterDeviceListRequest,
    PackageItem,
    RegisterDeviceItem
} from './types'

export const useStationStore = defineStore('register-device-list-store', () => {
    const dataSource = ref<RegisterDeviceItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: RegisterDeviceListRequest) {
        try {
            const result = await fetchDeviceList(data)
            if (result) {
                const { list, pageNum: page, pageSize, total } = result

                dataSource.value = list
                pagination.value = {
                    page,
                    pageSize,
                    total
                }
            }

            return result
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    async function getResetDevice(skDeviceSn: string) {
        try {
            const result = await fetchResetDevice(skDeviceSn)
            if (result.msg === 'success') {
                return result
            }
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    const packageListWith4G = ref<PackageItem[]>()
    const packageListWithMCU = ref<PackageItem[]>()

    return {
        dataSource,
        pagination,
        getDataList,
        getResetDevice,
        packageListWith4G,
        packageListWithMCU
    }
})
