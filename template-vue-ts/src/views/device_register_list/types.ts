export interface DeviceRegisterRequest {
    /**
     * 创建时间
     */
    createTimes?: string[]
    pageNum: number
    pageSize: number
    /**
     * 加油站名称
     */
    siteName?: string
    /**
     * 加油站id
     */
    siteId?: string
    /**
     * 设备编号
     */
    skDeviceSn?: string
    /**
     * 设备当前状态，0未注册,1注册中,2已注册
     */
    status?: string
    /**
     * 操作类型，0注册 1取消注册(作为重新注册的旧设备)
     */
    type?: string
    province?: string
    city?: string
    county?: string
}

export interface DeviceRegisterItem {
    /**
     * 注册时间
     */
    createTime?: string
    id: number
    /**
     * 加油站id
     */
    siteId?: number
    /**
     * 加油站名称
     */
    siteName?: string
    /**
     * 设备编码
     */
    skDeviceSn?: string
    /**
     * 设备状态，0未注册,1注册中,2已注册
     */
    status?: string
    /**
     * 设备名称
     */
    tankerName?: null
    /**
     * 操作类型，0注册 1取消注册(作为重新注册的旧设备)
     */
    type?: string
}

// 详情
export interface DeviceRegisterResult {
    [key: string]: any
}
