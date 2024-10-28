import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard-store', () => {
    const analysis = ref({
        oilStation: {
            label: '油站数量',
            total: 100,
            lastTotal: 90,
            today: 0,
            percent: 30,
            icon: 'banmao:gas-station'
        }
    })

    return {
        analysis
    }
})
