import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMonthReportList } from './service'
import type { MonthReportRequest, MonthReportItem } from './types'

export const useMonthReportStore = defineStore('month_report', () => {
    const dataSource = ref<MonthReportItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: MonthReportRequest) {
        try {
            const result = await fetchMonthReportList(data)
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
