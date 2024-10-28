import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchOilLedgerDetailList } from '../service'
import type { OilLedgerRequest, OilLedgerItem } from '../types'

export const useOilDetailStore = defineStore('oil-detail-store', () => {
    const dataSource = ref<OilLedgerItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: OilLedgerRequest) {
        try {
            const result = await fetchOilLedgerDetailList(data)
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
