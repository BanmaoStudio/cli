import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    fetchDataList,
    saveAccountData,
    deleteAccount,
    fetchAllRole,
    editPasswordData,
    editAccountData,
    fetchPassKey
} from './service'
import type { AccountRequest, Account } from './types'
import { EnumResponseCode } from '@/enums'

export const useAccountStore = defineStore('account-store', () => {
    const dataSource = ref<Account[]>()
    const pagination = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })

    async function getDataList(data: AccountRequest) {
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
            const { status, data } = await fetchAllRole()
            if (status === 0) {
                return data
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    async function saveData(data: Omit<Account, 'createTime' | 'id'>) {
        try {
            const result = await saveAccountData(data)
            if (result) {
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }
    async function editData(data: Omit<Account, 'createTime'>) {
        try {
            const result = await editAccountData(data)
            if (result) {
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    async function deleteData(id: number) {
        try {
            const result = await deleteAccount(id)
            if (result.status === EnumResponseCode.SUCCESS) {
                getDataList({ page: 1, pageSize: 10 })
                return result
            }
            return null
        } catch (error) {
            throw new Error(error as string)
        }
    }
    async function resetPassword(data: any) {
        try {
            const result = await editPasswordData(data)
            if (result.status === EnumResponseCode.SUCCESS) {
                return result
            }
            return null
        } catch (error) {
            throw new Error(error as string)
        }
    }

    async function getPassKey() {
        try {
            const { status, data } = await fetchPassKey()
            if (status === 0) {
                return data
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    return {
        dataSource,
        pagination,
        getDataList,
        saveData,
        deleteData,
        getAllRole,
        editData,
        resetPassword,
        getPassKey
    }
})
