import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    fetchDataList,
    fetchMenuOptions,
    fetchAddMenu,
    fetchEditMenu,
    fetchDeleteMenu
} from './service'
import { EnumResponseCode } from '@/enums'

export const useMenuStore = defineStore('menu-store', () => {
    const dataSource = ref<any[]>()

    async function getDataList() {
        try {
            const result = await fetchDataList()
            if (result) {
                dataSource.value = result.data
            }

            return result
        } catch (error) {}
    }
    async function getMenuOptions() {
        try {
            const { status, data } = await fetchMenuOptions()
            if (status === 0) {
                return data
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    async function getAddMenu(data: any) {
        try {
            const result = await fetchAddMenu(data)
            if (result) {
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }
    async function getEditMenu(data: any) {
        try {
            const result = await fetchEditMenu(data)
            if (result) {
                return result
            }
        } catch (error) {
            throw new Error('Invalid: ' + error)
        }
    }

    async function getDeleteMenu(id: number) {
        try {
            const result = await fetchDeleteMenu(id)
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
        getDataList,
        getAddMenu,
        getMenuOptions,
        getEditMenu,
        getDeleteMenu
    }
})
