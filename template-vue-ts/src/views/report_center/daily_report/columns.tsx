import { Ref, ref } from 'vue'
import { DataTableColumns, NSpace } from 'naive-ui'
import { ProTableColumns } from '@/components/ProTable/types'
import ClipboardText from '@/components/common/ClipboardText.vue'
import { DailyReportItem } from './types'

type RowData = DailyReportItem

export const columns: Ref<ProTableColumns<RowData>> = ref([
    {
        title: '#',
        key: 'index',
        width: 48,
        align: 'center',
        fixed: 'left',
        render(_, index) {
            return index + 1
        }
    },
    {
        title: '加油站名称',
        key: 'siteName',
        minWidth: 200,
        maxWidth: 240,
        fixed: 'left'
    },
    {
        title: '所属地区',
        key: 'areaName',
        minWidth: 140,
        maxWidth: 160
    },
    {
        title: '液位仪编号',
        key: 'deviceNum',
        align: 'center',
        render(row: RowData) {
            return (
                <NSpace justify="center">
                    <ClipboardText text={row.deviceNum} />
                </NSpace>
            )
        },
        minWidth: 140,
        maxWidth: 160
    },
    {
        title: '进油量(L)',
        key: 'inputSum',
        minWidth: 120,
        maxWidth: 200
    },
    {
        title: '出油量(L)',
        key: 'outputSum',
        minWidth: 120,
        maxWidth: 200
    },
    {
        title: '销售量(L)',
        key: 'saleSum',
        minWidth: 120,
        maxWidth: 200
    },
    {
        title: '销售金额(￥)',
        key: 'saleAmount',
        minWidth: 120,
        maxWidth: 200
    },
    {
        title: '出油总金额(￥)',
        key: 'outputAmount',
        minWidth: 120,
        maxWidth: 200
    },
    {
        title: '时间',
        key: 'date',
        width: 180
    }
]) as Ref<DataTableColumns<RowData>>
