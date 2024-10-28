import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchTankerRecordList } from './service'
import type { FuelDispenserFlowRequest, FuelDispenserFlowItem } from './types'

export const useFuelDispenserFlow = defineStore('fuel_dispenser_flow', () => {
    const dataSource = ref<FuelDispenserFlowItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: FuelDispenserFlowRequest) {
        try {
            const result = await fetchTankerRecordList(data)
            if (result && result.data) {
                const { list, pageNum, pageSize, total } = result.data

                dataSource.value = list
                pagination.value = {
                    page: pageNum,
                    pageSize,
                    total
                }
            }

            return result
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    return {
        dataSource,
        pagination,
        getDataList
    }
})
