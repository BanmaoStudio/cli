import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchDailyReportList } from './service'
import type { DailyReportRequest, DailyReportItem } from './types'

export const useDailyReportStore = defineStore('daily_report', () => {
    const dataSource = ref<DailyReportItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: DailyReportRequest) {
        try {
            const result = await fetchDailyReportList(data)
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
