export interface MonthReportRequest extends RequestPagination {
    /** 加油站名称 */
    siteName?: string
    /**省市区编码 */
    county?: string
    city?: string
    province?: string
    /** 月份 */
    month?: string

    pageNum: number
    pageSize: number
}

export interface MonthReportItem {
    id: string | number
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
    month: string
}
