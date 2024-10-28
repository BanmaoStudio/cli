export interface OilInletRequest extends RequestPagination {
    /** 油罐编号 */
    tankNum?: number | null
    /** 加油站名称 */
    siteName?: string
    /** 油品 */
    oilName?: string
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

export interface OilInletItem {
    /** ID */
    id: number
    /** 油罐编号 */
    tankNum: number
    /** 加油站名称 */
    siteName: string
    /** 地区 */
    areaName: string
    /** 液位仪编号 */
    deviceNum: string
    /** 油品 */
    oilName: string
    /** 油罐余量 */
    oilMargin: number
    /** 液位仪采集量 */
    inputSum: number
    createTime: string
}
