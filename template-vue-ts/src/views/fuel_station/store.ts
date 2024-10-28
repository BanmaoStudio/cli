import { defineStore } from 'pinia'
import { ref } from 'vue'
import { FuelStationForm, FuelStationItem, FuelStationParams } from './types'
import {
    fetchAddFuelStation,
    fetchDeleteFuelStation,
    fetchEditFuelStation,
    fetchFuelStationList
} from './service'

export const useFuelStationStore = defineStore('fuel-station-store', () => {
    const dataSource = ref<FuelStationItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: FuelStationParams) {
        try {
            const result = await fetchFuelStationList(data)
            if (result) {
                const { list, pageNum: page, pageSize, total } = result
                dataSource.value = list
                // pagination.value = { ...pagination.value, page, pageSize, total };
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

    async function saveData(data: FuelStationForm) {
        const requestFn = data.id ? fetchEditFuelStation : fetchAddFuelStation
        try {
            const result = await requestFn(data)
            if (result) {
                // 保存成功后的处理逻辑
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    async function deleteData(id: number) {
        try {
            const result = await fetchDeleteFuelStation(id)
            if (result) {
                // 删除成功后的处理逻辑
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    return {
        getDataList,
        saveData,
        deleteData
    }
})
