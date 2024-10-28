import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ListPsimCard } from './types'
import { fetchGetByIccIdList } from './service'

export const useGetByIccIdStore = defineStore('fuel-station-store', () => {
    async function iccIdData(data: { IccId: string }) {
        try {
            const result = await fetchGetByIccIdList(data)
            if (result) {
                // 保存成功后的处理逻辑
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    return {
        iccIdData
    }
})
