import { Ref, ref } from 'vue'
import {
    DataTableColumns,
    NTag,
    NSpace,
    NButton,
    NPopconfirm,
    useMessage
} from 'naive-ui'
import { ProTableColumns } from '@/components/ProTable/types'
import ClipboardText from '@/components/common/ClipboardText.vue'
import SignalStrength from '@/components/LocalIcon/SignalStrength.vue'
import { RegisterDeviceItem } from './types'
import { useStationStore } from './store'

const store = useStationStore()

type RowData = RegisterDeviceItem

export const createColumns = (
    emit: (event: string) => void
): Ref<ProTableColumns<RowData>> => {
    return ref([
        {
            title: '#',
            key: 'index',
            width: 60,
            align: 'center',
            fixed: 'left',
            render(_, index) {
                return index + 1
            }
        },
        {
            title: '加油站名称',
            key: 'siteName',
            titleAlign: 'center',
            width: 220,
            fixed: 'left'
        },
        {
            title: '地区',
            key: 'areaName',
            titleAlign: 'center',
            width: 160
        },
        {
            title: '加油机名称',
            key: 'tankerName',
            align: 'center',
            width: 120
        },
        {
            title: '油枪数量',
            key: 'gunNum',
            align: 'center',
            width: 120
        },
        {
            title: '状态',
            key: 'onlineStatus',
            width: 100,
            render(row: RowData) {
                return (
                    <NTag
                        type={+row.onlineStatus === 1 ? 'success' : 'error'}
                        size="small"
                    >
                        {+row.onlineStatus === 1 ? '在线' : '离线'}
                    </NTag>
                )
            }
        },
        {
            title: '信号质量',
            key: 'sk4gSignalIntensity',
            align: 'center',
            width: 120,
            render(row: RowData) {
                return (
                    <NSpace justify="center">
                        <SignalStrength signal={row.sk4gSignalIntensity} />
                    </NSpace>
                )
            }
        },
        {
            title: '加油机设备编号',
            key: 'skDeviceSn',
            width: 240,
            titleAlign: 'center',
            render(row: RowData) {
                return <ClipboardText text={row.skDeviceSn as string} />
            }
        },
        {
            title: 'IMEI',
            key: 'sk4gImei',
            width: 200,
            titleAlign: 'center',
            render(row: RowData) {
                return <ClipboardText text={row.sk4gImei as string} />
            }
        },
        {
            title: 'ICCID',
            key: 'skSimCcid',
            width: 200,
            titleAlign: 'center',
            render(row: RowData) {
                return <ClipboardText text={row.skSimCcid as string} />
            }
        },

        {
            title: '心跳时间',
            key: 'heartTime',
            titleAlign: 'center',
            width: 180
        },
        {
            title: '注册时间',
            key: 'createTime',
            titleAlign: 'center',
            width: 180
        },
        {
            title: '操作',
            key: 'actions',
            width: 120,
            align: 'center',
            fixed: 'right',

            render(row: RowData) {
                const message = useMessage()
                const handleDeleteById = async (skDeviceSn: string) => {
                    const res = await store.getResetDevice(skDeviceSn)
                    if (res && res.status === 0) {
                        message.success('重置成功')
                        emit('update-list')
                    } else {
                        console.error('设备重置失败', res)
                    }
                }
                return (
                    <NPopconfirm
                        onPositiveClick={() => handleDeleteById(row.skDeviceSn)}
                        positiveText="确定"
                        negativeText="取消"
                        v-slots={{
                            default: () => '你确定要重置设备吗？',
                            trigger: () => (
                                <NButton
                                    ghost
                                    type="info"
                                    size="tiny"
                                    class="pt-1px pb-1px"
                                >
                                    重置设备
                                </NButton>
                            )
                        }}
                    />
                )
            }
        }
    ]) as Ref<DataTableColumns<RowData>>
}
