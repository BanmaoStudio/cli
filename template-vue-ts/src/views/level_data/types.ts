export interface LevelDataRequest extends RequestPagination {
    /** 油罐编号 */
    tankNum?: number | null
    /** 加油站名称 */
    siteName?: string
    /** 设备编号 */
    deviceNum?: string
    /** 开始时间 */
    startTime?: string
    /** 结束时间 */
    endTime?: string
    /**省市区编码 */
    county?: string
    city?: string
    province?: string
    pageNum: number
    pageSize: number
}

export interface LevelDataItem {
    /** ID */
    id: number
    /** 油罐编号 */
    tankNum: number
    /** 加油站名称 */
    siteName: string
    /** 地区 */
    areaName: string
    /** 设备编号 */
    deviceNum: string
    /** 油品 */
    oilName: string
    /** 油余量 */
    oilAllowance: number
    /** 油高 */
    oilHeight: number
}
