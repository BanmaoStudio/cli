import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchOutRecordList } from './service'
import type { OilDischargeRequest, OilDischargeItem } from './types'

export const useOilDischargeStore = defineStore('oil_discharge_record', () => {
    const dataSource = ref<OilDischargeItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: OilDischargeRequest) {
        try {
            const result = await fetchOutRecordList(data)
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

    return {
        dataSource,
        pagination,
        getDataList
    }
})
