import { EnumResponseCode } from '@/enums/responseCode'
import { OptionsType } from './types'
import { ref } from 'vue'
import { useExportFile } from '@/hooks'
import { getPagination } from '@/utils'

export function useList<
    T extends (...args: any) => Promise<ResponseData<ResponseDataList<any>>>
>(listRequestFn: T, options: OptionsType = {}) {
    const { exportRequestFn, filterOption = ref(), callback } = options

    // 加载态
    const loading = ref(false)
    const pagination = ref({
        page: 1,
        pageSize: 10,
        itemCount: 0
    })
    // 数据
    const dataSource = ref<any[]>([])

    /**
     * 加载数据
     * @param page - 当前页
     * @param pageSize - 页数
     */

    const loadData = async (
        page = pagination.value.page,
        pageSize = pagination.value.pageSize
    ) => {
        loading.value = true
        try {
            const { status, data } = await listRequestFn({
                pageNum: page,
                pageSize,
                ...filterOption.value
            })

            const { list, ...paginationData } =
                (callback && callback(data)) || data
            if (status === EnumResponseCode.SUCCESS && Array.isArray(list)) {
                dataSource.value = list
                pagination.value = {
                    ...getPagination({
                        page: paginationData.pageNum,
                        ...paginationData
                    })
                }
            } else {
                dataSource.value = []
                pagination.value = {
                    pageSize: 10,
                    itemCount: 0,
                    page: 1
                }
                throw new Error('list的数据类型错误')
            }
        } catch (error) {
            loading.value = false
            throw new Error(error as string)
        } finally {
            loading.value = false
        }
    }

    /**
     * 导出文件
     */
    const handleExcelData = async () => {
        if (!exportRequestFn && typeof exportRequestFn !== 'function') {
            throw new Error('当前没有提供exportRequest函数')
        }
        try {
            const { data, fileName } = await exportRequestFn(filterOption.value)
            useExportFile(data, fileName)
            window.$message?.success('成功导出')
        } catch (error) {
            throw new Error(error as string)
        }
    }

    const handlePageChange = (page: number) => {
        loadData(page)
    }

    const handlePageSizeChange = (pageSize: number) => {
        loadData(1, pageSize)
    }

    onMounted(() => {
        loadData(pagination.value.page)
    })

    return {
        dataSource,
        loading,
        pagination,
        handleExcelData,
        handlePageChange,
        handlePageSizeChange,
        loadData
    }
}

export default useList
