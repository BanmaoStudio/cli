export interface FuelDispenserFlowRequest extends RequestPagination {
    /** 设备编号 */
    skDeviceSn?: string
    /** 上传时间 */
    skUpTime?: any
    /** 油枪编号 */
    gunNo?: string
    /** 油站id */
    siteId?: string
    pageNum: number
    pageSize: number
}

export interface FuelDispenserFlowItem {
    id: number | string
    /** 枪号 */
    gunNo: string
    /** 设备编号 */
    skDeviceSn: string
    /** 编码器金额 */
    pulseAmount: number
    /** 油站名称 */
    siteName: string
    /** 税控油量总累 */
    skTalOil: number
    /** 加油开始时间 */
    addOilStartTime: string
    /** 税控金额总累 */
    skTalMoney: number
    /** 编码器油量 */
    pulseOilVal: number
    /** 税控油量 */
    skOilVal: number
    /** 税控单价 */
    skPrice: number
    /** 税控金额 */
    skAmount: number
    /** 加油机名称 */
    tankerName: string
    /** 编码器单价 */
    pulsePrice: number
    /** 税控序列号 */
    skSerialNumber: string
    /** 加油结束时间 */
    addOilStopTime: string
    /** 编码器序列号 */
    pulseSerialNumber: string
    /** 上传时间 */
    skUpTime: string
}
