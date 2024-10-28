import { Ref, ref } from 'vue'
import { DataTableColumns } from 'naive-ui'
import { ProTableColumns } from '@/components/ProTable/types'
import { OilLedgerItem } from '../types'

type RowData = OilLedgerItem

export const columns: Ref<ProTableColumns<RowData>> = ref([
    // {
    //     title: '#',
    //     key: 'index',
    //     width: 60,
    //     align: 'center',
    //     fixed: 'left',
    //     render(_, index) {
    //         return index + 1
    //     }
    // },
    // {
    //     title: '加油站名称',
    //     key: 'siteName',
    //     width: 120,
    //     fixed: 'left'
    // },
    // {
    //     title: '液位仪编号',
    //     key: 'deviceNum',
    //     render(row: RowData) {
    //         return <ClipboardText text={row.deviceNum as string} />
    //     },
    //     width: 100
    // },
    {
        title: '油罐编号',
        key: 'tankNum',
        width: 100
    },
    {
        title: '油品',
        key: 'oilName',
        width: 100
    },
    {
        title: '期出数量',
        key: 'beforeMargin',
        width: 100
    },
    {
        title: '期末数量',
        key: 'oilMargin',
        width: 100
    },
    {
        title: '出油量(L)',
        key: 'outputSum',
        width: 100
    },
    {
        title: '进油量(L)',
        key: 'inputSum',
        width: 100
    },
    {
        title: '销售量(L)',
        key: 'saleSum',
        width: 100
    },
    {
        title: '获取时间',
        key: 'createTime',
        width: 100
    }
]) as Ref<DataTableColumns<RowData>>
