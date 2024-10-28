import { post } from '@/utils/request'
import { DailyReportRequest, DailyReportItem } from './types'
enum Api {
    // 日度报表中心
    DailyReportList = '/report/dayReport',
    // 导出
    DailyReportExportList = '/report/dayReportExport'
}

// 用于日度报表中心
export function fetchDailyReportList(data: DailyReportRequest) {
    return post<
        ResponseData<{
            list: ResponseDataList<DailyReportItem>
            [key: string]: any
        }>
    >({
        // 请求地址
        url: Api.DailyReportList,
        // 请求参数
        data
    })
}
// 导出
export function fetchDailyReportExportList(data: DailyReportRequest) {
    return post({
        url: Api.DailyReportExportList,
        responseType: 'blob',
        data
    })
}
