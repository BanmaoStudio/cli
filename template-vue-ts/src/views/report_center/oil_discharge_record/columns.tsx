import { Ref, ref } from 'vue'
import { DataTableColumns, NSpace, NTag } from 'naive-ui'
import { ProTableColumns } from '@/components/ProTable/types'
import ClipboardText from '@/components/common/ClipboardText.vue'
import { OilDischargeItem } from './types'

type RowData = OilDischargeItem

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
        width: 200,
        fixed: 'left'
    },
    {
        title: '所属地区',
        key: 'areaName',
        minWidth: 200
    },
    {
        title: '油罐编号',
        key: 'tankNum',
        align: 'center',
        width: 200
    },
    {
        title: '油品',
        key: 'oilName',
        align: 'center',
        minWidth: 100,
        maxWidth: 150,
        render(row: RowData) {
            return (
                <NSpace justify="center">
                    <NTag size="small" type="info">
                        {row.oilName}
                    </NTag>
                </NSpace>
            )
        }
    },
    {
        title: '液位仪编号',
        key: 'deviceNum',
        align: 'center',
        render(row: RowData) {
            return (
                <NSpace justify="center">
                    <ClipboardText text={row.deviceNum as string} />
                </NSpace>
            )
        },
        minWidth: 200
    },
    {
        title: '液位仪采集量(L)',
        key: 'outputSum',
        width: 180
    },
    {
        title: '油罐余量(L)',
        key: 'oilMargin',
        width: 160
    },
    {
        title: '时间',
        key: 'createTime',
        width: 180,
        align: 'center',
        fixed: 'right'
    }
]) as Ref<DataTableColumns<RowData>>
