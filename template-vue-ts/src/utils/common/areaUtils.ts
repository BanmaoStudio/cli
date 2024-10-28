// areaUtils.js
import { ref } from 'vue'
import { fetchAllAreaCode } from '@/services'

export const areaOptions = ref([])
export const areaValue = ref('')

export const loadAllAreaData = async () => {
    try {
        const res = await fetchAllAreaCode()
        const { status, data } = res
        if (status === 0) {
            areaOptions.value = transformData(data)
        }
    } catch (error) {
        throw new Error(error)
    }
}

const transformData = (items) => {
    return items.map((item) => ({
        label: item.name,
        value: item.code,
        children: item.children ? transformData(item.children) : undefined
    }))
}

const findPath = (value, options, currentPath = []) => {
    for (const option of options) {
        const newPath = [...currentPath, option]
        if (option.value === value) {
            return newPath
        } else if (option.children) {
            const result = findPath(value, option.children, newPath)
            if (result) return result
        }
    }
    return null
}

export const areaFn = (value, searchParams) => {
    const fullPath = findPath(value, areaOptions.value)
    if (fullPath && fullPath.length > 0) {
        if (fullPath.length === 1) {
            searchParams.value.province = fullPath[0].value
            searchParams.value.city = ''
            searchParams.value.county = ''
        } else if (fullPath.length === 2) {
            searchParams.value.province = fullPath[0].value
            searchParams.value.city = fullPath[1].value
            searchParams.value.county = ''
        } else if (fullPath.length > 2) {
            searchParams.value.province = fullPath[0].value
            searchParams.value.city = fullPath[1].value
            searchParams.value.county = fullPath[2].value
        }
    }
}
