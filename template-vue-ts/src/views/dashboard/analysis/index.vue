<template>
    <n-grid items-responsive="screen" :x-gap="16">
        <n-gi :span="4">
            <statistic-panel v-bind="oilStation" />
        </n-gi>
        <n-gi :span="4">
            <statistic-panel v-bind="oilStation" />
        </n-gi>
        <n-gi :span="4">
            <statistic-panel v-bind="oilStation" />
        </n-gi>
        <n-gi :span="4">
            <statistic-panel v-bind="oilStation" />
        </n-gi>
    </n-grid>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import StatisticPanel from './components/StatisticPanel.vue'
import { useDashboardStore } from '../store'

const store = useDashboardStore()

const oilStation = computed(() => {
    return store.analysis.oilStation
})
</script>
