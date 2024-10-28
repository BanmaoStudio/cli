import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    fetchDeviceById,
    fetchDeviceRegisterList,
    historyDetailsId
} from './service'
import type { DeviceRegisterItem, DeviceRegisterRequest } from './types'
import { EnumResponseCode } from '@/enums'

export const useDeviceRegisterListStore = defineStore(
    'device-register-list-store',
    () => {
        const dataSource = ref<DeviceRegisterItem[]>()
        const pagination = ref({
            page: 1,
            pageSize: 10,
            total: 0
        })

        async function getDataList(data: DeviceRegisterRequest) {
            try {
                const result = await fetchDeviceRegisterList(data)
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

        async function refreshDevice(id: number) {
            try {
                const { status, data } = await fetchDeviceById(id)
                if (status === EnumResponseCode.SUCCESS) {
                    window.$message?.success('刷新成功')
                    return data
                } else {
                    window.$message?.error('刷新失败')
                    return data
                }
            } catch (error) {
                window.$message?.error('服务器错误')
                throw new Error('Invalid: ' + error)
            }
        }
        // 历史详情
        async function historyDetails(id: number) {
            try {
                const { data } = await historyDetailsId(id)
                return data
            } catch (error) {
                window.$message?.error('服务器错误')
                throw new Error('Invalid: ' + error)
            }
        }

        return {
            dataSource,
            pagination,
            getDataList,
            // 刷新当前数据
            refreshDevice,
            // 注册机历史详情
            historyDetails
        }
    }
)
