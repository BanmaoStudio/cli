import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHistoryDetails } from '../service'
import type { LevelDataRequest, LevelDataItem } from '../types'

export const useHistoryStore = defineStore('history-store', () => {
    const dataSource = ref<LevelDataItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: LevelDataRequest) {
        try {
            const result = await fetchHistoryDetails(data)
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
