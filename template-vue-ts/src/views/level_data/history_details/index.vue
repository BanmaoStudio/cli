<template>
    <n-layout class="bg-transparent">
        <n-card>
            <n-form label-placement="left" :show-feedback="false">
                <n-grid x-gap="16" :cols="3">
                    <n-form-item-gi label="时间:">
                        <n-date-picker
                            v-model:value="range"
                            type="daterange"
                            clearable
                        />
                    </n-form-item-gi>
                    <n-gi suffix>
                        <n-space justify="end">
                            <n-button type="info" @click="handleSearch"
                                >搜索</n-button
                            >
                            <n-button
                                strong
                                secondary
                                type="tertiary"
                                @click="handleReset"
                                >重置</n-button
                            >
                        </n-space>
                    </n-gi>
                </n-grid>
            </n-form>
        </n-card>
        <pro-table
            :page-title="pageTitle"
            :columns="columns"
            :loading="loading"
            :data-source="dataSource"
            :row-key="rowKey"
            @load-data="loadData"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            :pagination="pagination"
        />
    </n-layout>
</template>
<script setup lang="tsx">
import { Ref, ref, inject } from 'vue'
import { useHistoryStore } from './store'
import { useList } from '@/hooks'
import { LevelDataRequest, LevelDataItem } from '../types'

import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { columns } from './columns'

const detailParams = inject<
    Ref<{ deviceNum: string; tankNum: number; siteName: string }>
>('detailParams', ref({ deviceNum: '', tankNum: 0, siteName: '' }))

const { deviceNum, tankNum, siteName } = detailParams.value

const route = useRoute()
const pageTitle = computed(() => {
    return '数据列表'
})

const range = ref<any>(null)

type RowData = LevelDataItem
const rowKey = (row: RowData) => row.id

type SearchParams = Omit<LevelDataRequest, 'pageNum' | 'pageSize'>

// const deviceNum = route.query.deviceNum || ''
// const tankNum = Number(route.query.tankNum)

// 检查转换后的 tankNum 是否为有效数字
// const validTankNum = isNaN(defaultParams.tankNum) ? '' : tankNum

const searchParams = ref<SearchParams>({
    deviceNum,
    startTime: '',
    endTime: '',
    tankNum
})
const store = useHistoryStore()
/** 获取列表数据 */
const {
    dataSource,
    loading,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    loadData
} = useList<any>(store.getDataList, {
    filterOption: searchParams
})
// 搜索
const handleSearch = () => {
    if (range.value && range.value.length > 0) {
        searchParams.value.startTime =
            dayjs(range.value[0]).format('YYYY-MM-DD') + ' 00:00:00'
        searchParams.value.endTime =
            dayjs(range.value[1]).format('YYYY-MM-DD') + ' 23:59:59'
    } else {
        searchParams.value.startTime = ''
        searchParams.value.endTime = ''
    }

    loadData()
}

// 重置
const handleReset = () => {
    range.value = null
    searchParams.value.startTime = ''
    searchParams.value.endTime = ''
    pagination.value = {
        page: 1,
        pageSize: 10,
        itemCount: 0
    }
    loadData()
}
</script>
