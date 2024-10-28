import { post } from '@/utils/request'
import { OilDischargeRequest, OilDischargeItem } from './types'
enum Api {
    // 出油记录
    OutRecordList = '/report/outRecord',
    // 导出
    OutRecordExportList = '/report/outRecordExport'
}

// 用于获取出油记录
export function fetchOutRecordList(data: OilDischargeRequest) {
    return post<ResponseDataList<OilDischargeItem>>({
        // 请求地址
        url: Api.OutRecordList,
        // 请求参数
        data
    })
}
// 导出
export function fetchOutRecordExportList(data: OilDischargeRequest) {
    return post({
        url: Api.OutRecordExportList,
        responseType: 'blob',
        data
    })
}
