export interface DailyReportRequest extends RequestPagination {
    /** 加油站名称 */
    siteName?: string
    /**省市区编码 */
    county?: string
    city?: string
    province?: string
    /** 开始时间 */
    startTime?: string
    /** 结束时间 */
    endTime?: string
    pageNum: number
    pageSize: number
}

export interface DailyReportItem {
    id: number | string
    /** 加油站名称 */
    siteName: string
    /** 地区 */
    areaName: string
    /** 液位仪编号 */
    deviceNum: string
    /** 总出油量(L) */
    outputSum: number
    /** 总进油量(L) */
    inputSum: number
    /** 总销售量 */
    saleSum: number
    /** 销售金额 */
    saleAmount: number
    /** 出油总金额 */
    outputAmount: number
    date: string
}
