import { RouteRecordRaw } from 'vue-router'
import { BlankLayout } from '@/layouts'
import IconReport from '~icons/icon-park-outline/table-report'

const SystemRoutes: RouteRecordRaw = {
    path: '/report_center',
    component: BlankLayout,
    name: 'report-group',
    meta: {
        title: '报表中心',
        roles: ['admin', 'user'],
        order: 7,
        icon: IconReport
    },
    redirect: '/report_center/oil_discharge_record',
    children: [
        {
            path: '/report_center/oil_discharge_record',
            name: 'OilDischargeRecord',
            meta: {
                title: '出油记录',
                roles: ['admin', 'user'],
                order: 1
            },
            component: () =>
                import('@/views/report_center/oil_discharge_record/index.vue')
        },
        {
            path: '/report_center/oil_inlet_record',
            name: 'OilInletRecord',
            meta: {
                title: '进油记录',
                roles: ['admin', 'user'],
                order: 1
            },
            component: () =>
                import('@/views/report_center/oil_inlet_record/index.vue')
        },
        {
            path: '/report_center/oil_ledger',
            name: 'OilLedge',
            meta: {
                title: '进出油台账',
                roles: ['admin', 'user'],
                order: 1
            },
            component: () =>
                import('@/views/report_center/oil_ledger/index.vue')
        },
        {
            path: '/report_center/daily_report',
            name: 'DailyReport',
            meta: {
                title: '日度报表中心',
                roles: ['admin', 'user'],
                order: 1
            },
            component: () =>
                import('@/views/report_center/daily_report/index.vue')
        },
        {
            path: '/report_center/monthly_report',
            name: 'MonthlyReport',
            meta: {
                title: '月度报表中心',
                roles: ['admin', 'user'],
                order: 1
            },
            component: () =>
                import('@/views/report_center/monthly_report/index.vue')
        }
    ]
}

export default SystemRoutes
