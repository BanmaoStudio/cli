export interface RegisterDeviceListRequest extends RequestPagination {
    /** 设备编码 */
    deviceSn?: string
    /** 加油站id */
    siteId?: string
    onlineStatus?: string
    county?: string
    city?: string
    province?: string
    pageNum: number
    pageSize: number
}

export interface RegisterDeviceItem {
    /** ID */
    id: number
    /** fuel Station Name */
    siteName: string
    /** fuel dispenser name */
    tankerName: string
    /** 创建时间 */
    createTime: string
    /** 厂家名称 */
    factoryName: null | string
    /** 出厂编号 */
    factoryNum: null | string
    /** 出厂日期 */
    factoryTime: null
    /** 油机枪数 */
    gunNum: number | null
    /** 是否连接枪开关，0否 1是 */
    linkGunOff: null | string
    /** 是否连接编码器，0否 1是 */
    linkPulse: string
    /** 油站id */
    siteId: number | null
    /** 4G固件版本 */
    sk4gFirmwareVer: string
    /** 4g模块，1不更新，2更新 */
    sk4gFlag: number
    /** 物联网IMEI */
    sk4gImei: string
    /** 4G模块信号强度 */
    sk4gSignalIntensity: string
    /** 4G固件包地址 */
    sk4gUrl: string
    /** 加油机设备编号 */
    skDeviceSn: string
    /** MCU版本 */
    skMcuFirmwareVer: string
    /** mcu模块，1不更新，2更新 */
    skMcuFlag: number
    /** mcu固件包地址 */
    skMcuUrl: string
    /** 是否注册设备，1未注册 2已注册 */
    skRegisterFlag: number
    /** 物联网iccid */
    skSimCcid: string
    /** 上传时间 */
    skUpTime: string
    /** 更新时间 */
    updateTime: string
    /** 状态 */
    onlineStatus: '1' | '2'
    [property: string]: any
}

export interface PackageItem {
    /** id */
    id: string
    /** 固件包类型，0:mcu 1:4g */
    type: string
    /** 固件包地址 */
    url: string
    /** 固件包版本 */
    version: string
}
