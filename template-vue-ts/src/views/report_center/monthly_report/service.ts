import { post } from '@/utils/request'
import { MonthReportRequest, MonthReportItem } from './types'
enum Api {
    // 月度报表中心
    MonthReportList = '/report/monthReport',
    // 导出
    MonthReportExportList = '/report/monthReportExport'
}

// 用于获取月度报表中心
export function fetchMonthReportList(data: MonthReportRequest) {
    return post<
        ResponseData<{
            list: ResponseDataList<MonthReportItem>
            [key: string]: any
        }>
    >({
        // 请求地址
        url: Api.MonthReportList,
        // 请求参数
        data
    })
}
// 导出
export function fetchMonthReportExportList(data: MonthReportRequest) {
    return post({
        url: Api.MonthReportExportList,
        responseType: 'blob',
        data
    })
}
