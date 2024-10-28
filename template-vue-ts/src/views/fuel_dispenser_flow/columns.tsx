import { Ref, ref } from 'vue'
import { DataTableColumns, NSpace } from 'naive-ui'
import { ProTableColumns } from '@/components/ProTable/types'
import ClipboardText from '@/components/common/ClipboardText.vue'
import { FuelDispenserFlowItem } from './types'

type RowData = FuelDispenserFlowItem

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
        title: '加油机名称',
        key: 'tankerName',
        minWidth: 200,
        maxWidth: 240
    },
    {
        title: '枪号',
        key: 'gunNo',
        minWidth: 80,
        maxWidth: 100
    },
    {
        title: '设备编号',
        key: 'skDeviceSn',
        render(row: RowData) {
            return (
                <NSpace justify="center">
                    <ClipboardText text={row.skDeviceSn} />
                </NSpace>
            )
        },
        minWidth: 160,
        maxWidth: 200
    },
    {
        title: '编码器序列号',
        key: 'pulseSerialNumber',
        minWidth: 160,
        maxWidth: 200
    },
    {
        title: '税控序列号',
        key: 'skSerialNumber',
        minWidth: 200,
        maxWidth: 240
    },
    {
        title: '编码器油量',
        key: 'pulseOilVal',
        minWidth: 100,
        maxWidth: 120
    },
    {
        title: '税控油量',
        key: 'skOilVal',
        minWidth: 100,
        maxWidth: 120
    },

    {
        title: '编码器单价',
        key: 'pulsePrice',
        minWidth: 100,
        maxWidth: 120
    },
    {
        title: '税控单价',
        key: 'skPrice',
        minWidth: 100,
        maxWidth: 120
    },

    {
        title: '编码器金额',
        key: 'pulseAmount',
        minWidth: 100,
        maxWidth: 120
    },
    {
        title: '税控金额',
        key: 'skAmount',
        minWidth: 100,
        maxWidth: 160
    },
    {
        title: '税控金额总累',
        key: 'skTalMoney',
        minWidth: 120,
        maxWidth: 140
    },
    {
        title: '税控油量总累',
        key: 'skTalOil',
        minWidth: 120,
        maxWidth: 140
    },

    {
        title: '加油开始时间',
        key: 'addOilStartTime',
        minWidth: 180,
        maxWidth: 200
    },
    {
        title: '加油结束时间',
        key: 'addOilStopTime',
        minWidth: 180,
        maxWidth: 200
    },
    {
        title: '上传时间',
        key: 'skUpTime',
        minWidth: 180,
        maxWidth: 200
    }
]) as Ref<DataTableColumns<RowData>>
