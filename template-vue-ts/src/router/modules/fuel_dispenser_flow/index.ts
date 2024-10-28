import { RouteRecordRaw } from 'vue-router'
import IconDevice from '~icons/mingcute/chart-line-line'

const FuelDispenserFlowRoutes: RouteRecordRaw = {
    path: '/fuel_dispenser_flow',
    name: 'FuelDispenserFlow',
    meta: {
        title: '加油机流水',
        requiresAuth: true,
        keepAlive: false,
        permissions: ['admin', 'user'],
        icon: IconDevice,
        order: 5
    },
    component: () => import('@/views/fuel_dispenser_flow/index.vue')
}

export default FuelDispenserFlowRoutes
