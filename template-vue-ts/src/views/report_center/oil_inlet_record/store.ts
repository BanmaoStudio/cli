import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchInRecordList } from './service'
import type { OilInletRequest, OilInletItem } from './types'

export const useOilInletStore = defineStore('oil_inlet_record', () => {
    const dataSource = ref<OilInletItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: OilInletRequest) {
        try {
            const result = await fetchInRecordList(data)
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
