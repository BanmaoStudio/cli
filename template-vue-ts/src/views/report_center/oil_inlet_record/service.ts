import { post } from '@/utils/request'
import { OilInletRequest, OilInletItem } from './types'
enum Api {
    // 进油记录
    InRecordList = '/report/inRecord',
    // 导出
    InRecordExportList = '/report/inRecordExport'
}

// 用于获取进油记录
export function fetchInRecordList(data: OilInletRequest) {
    return post<ResponseDataList<OilInletItem>>({
        // 请求地址
        url: Api.InRecordList,
        // 请求参数
        data
    })
}
// 导出
export function fetchInRecordExportList(data: OilInletRequest) {
    return post({
        url: Api.InRecordExportList,
        responseType: 'blob',
        data
    })
}
