import { RouteRecordRaw } from 'vue-router'
import IconDevice from '~icons/carbon/gas-station'

const FuelStationRoutes: RouteRecordRaw = {
    path: '/fuel_station',
    name: 'FuelStation',
    meta: {
        title: '加油站管理',
        requiresAuth: true,
        keepAlive: false,
        permissions: ['admin', 'user'],
        icon: IconDevice,
        order: 3
    },
    component: () => import('@/views/fuel_station/index.vue')
}

export default FuelStationRoutes
