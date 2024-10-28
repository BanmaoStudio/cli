import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    fetchDataList,
    fetchAllRule,
    fetchAddRole,
    fetchUpdateRole,
    fetchDeleteRole
} from './service'
import { EnumResponseCode } from '@/enums'

export const useRoleStore = defineStore('role-store', () => {
    const dataSource = ref<any[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: any) {
        try {
            const result = await fetchDataList(data)
            if (result) {
                const { list, ...paginationData } = result

                dataSource.value = list
                const { pageNum, pageSize, total } = paginationData
                pagination.value = {
                    page: pageNum,
                    pageSize,
                    total
                }
            }

            return result
        } catch (error) {}
    }
    async function getAllRole() {
        try {
            const { status, data } = await fetchAllRule()
            if (status === 0) {
                return data
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    async function getAddRole(data: any) {
        try {
            const result = await fetchAddRole(data)
            if (result) {
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }
    async function getUpdateRole(data: any) {
        try {
            const result = await fetchUpdateRole(data)
            if (result) {
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    async function getDeleteRole(roleId: number) {
        try {
            const result = await fetchDeleteRole(roleId)
            if (result.status === EnumResponseCode.SUCCESS) {
                return result
            }
            return null
        } catch (error) {
            throw new Error(error as string)
        }
    }

    return {
        dataSource,
        pagination,
        getDataList,
        getAddRole,
        getAllRole,
        getUpdateRole,
        getDeleteRole
    }
})
