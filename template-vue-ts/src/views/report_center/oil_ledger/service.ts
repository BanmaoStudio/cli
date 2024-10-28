import { post } from '@/utils/request'
import { OilLedgerRequest, OilLedgerItem } from './types'
enum Api {
    // 进出油台账
    OilLedgerList = '/report/inAndOutRecord',
    // 进出油台账详情
    OilLedgerDetailList = '/report/inAndOutDetailRecord',
    // 导出
    OilLedgerExportList = '/report/inAndOutRecordExport',
    // 进出油台账详情导出
    DetailExportList = '/report/inAndOutDetailRecordExport'
}

// 用于获取进出油台账
export function fetchOilLedgerList(data: OilLedgerRequest) {
    return post<ResponseDataList<OilLedgerItem>>({
        // 请求地址
        url: Api.OilLedgerList,
        // 请求参数
        data
    })
}
// 导出
export function fetchOilLedgerExportList(data: OilLedgerRequest) {
    return post({
        url: Api.OilLedgerExportList,
        responseType: 'blob',
        data
    })
}
// 用于获取进出油台详情
export function fetchOilLedgerDetailList(params: any) {
    const { range, ...data } = params
    return post<ResponseDataList<OilLedgerItem>>({
        // 请求地址
        url: Api.OilLedgerDetailList,
        // 请求参数
        data: {
            ...data,
            startTime: range ? range[0] : '',
            endTime: range ? range[1] : ''
        }
    })
}
// 详情导出
export function fetchDetailExportList(data: OilLedgerRequest) {
    return post({
        url: Api.DetailExportList,
        responseType: 'blob',
        data
    })
}
