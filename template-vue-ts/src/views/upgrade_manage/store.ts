import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchUpgradeDeviceList, fetchUpgradeDeviceUrl } from './service'
import { UpgradeManageItem, UpgradeManageRequest } from './types'

interface UpgradePackageParams {
    id: string
    type: number | string
    urlId: string
}

export const useUpgradeManageStore = defineStore('upgrade-manage-store', () => {
    const dataSource = ref<UpgradeManageItem[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: UpgradeManageRequest) {
        try {
            const result = await fetchUpgradeDeviceList(data)
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

    const packageListWith4G = ref([])
    const packageListWithMCU = ref([])

    async function getPackageList(type: any) {
        try {
            const result = await fetchUpgradeDeviceUrl(type)
            if (result) {
            }

            return result
        } catch (error) {
            throw new Error('Invalid:' + error)
        }
    }

    async function upgradePackage(payload: UpgradePackageParams) {
        // TODO: 调用接口
        console.log('payload', payload)
    }

    return {
        dataSource,
        pagination,
        getDataList,
        packageListWith4G,
        packageListWithMCU,
        getPackageList,
        upgradePackage
    }
})
