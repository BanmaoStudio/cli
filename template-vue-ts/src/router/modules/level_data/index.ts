import { RouteRecordRaw } from 'vue-router'
import IconDevice from '~icons/healthicons/medium-level-outline'

const LevelDataRoutes: RouteRecordRaw = {
    path: '/level_data',
    name: 'levelData',
    meta: {
        title: '液位数据',
        requiresAuth: true,
        keepAlive: false,
        permissions: ['admin', 'user'],
        icon: IconDevice,
        order: 6
    },
    component: () => import('@/views/level_data/index.vue')
    // children: [
    //     {
    //         path: '/level_data/history_details',
    //         name: 'HistoryDetails',
    //         meta: {
    //             title: '历史详情',
    //             requiresAuth: true,
    //             hide: true
    //         },
    //         component: () =>
    //             import('@/views/level_data/history_details/index.vue')
    //     }
    // ]
}

export default LevelDataRoutes
