import { Ref, ref } from 'vue'
import { DataTableColumns, NSpace, NTag } from 'naive-ui'
import { ProTableColumns } from '@/components/ProTable/types'
import ClipboardText from '@/components/common/ClipboardText.vue'
import { LevelDataItem } from '../types'

type RowData = LevelDataItem

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
    // {
    //     title: '加油站名称',
    //     key: 'siteName',
    //     titleAlign: 'center',
    //     minWidth: 300,
    //     ellipsis: { tooltip: true },
    //     fixed: 'left'
    // },
    {
        title: '液位仪编号',
        key: 'deviceNum',
        titleAlign: 'center',
        width: 120,
        render(row: RowData) {
            return (
                <NSpace justify="center">
                    <ClipboardText text={row.deviceNum as string} />
                </NSpace>
            )
        }
    },
    {
        title: '油罐编号',
        key: 'tankNum',
        align: 'center',
        minWidth: 100
    },
    {
        title: '油品',
        key: 'oilName',
        align: 'center',
        minWidth: 100,
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
        title: '油高(mm)',
        key: 'oilHeight',
        align: 'center',
        minWidth: 150
    },
    {
        title: '余量(L)',
        key: 'oilAllowance',
        align: 'center',
        minWidth: 150
    },
    {
        title: '获取时间',
        key: 'createTime',
        minWidth: 180,
        align: 'center',
        fixed: 'right'
    }
]) as Ref<DataTableColumns<RowData>>
