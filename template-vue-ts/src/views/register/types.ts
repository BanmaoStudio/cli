export interface RegisterDeviceData {
    /**
     * 加油机信息
     */
    deviceInfo: DeviceInfo
    /**
     * 加油站信息
     */
    fuelSite: FuelStation
    /**
     * 是否首次注册，0否 1是
     */
    isFirst: string
    /**
     * 旧的加油机编号，非首次注册的话必填
     */
    oldSkDeviceSn?: string
    /**
     * 注册的加油机编号
     */
    skDeviceSn: string
    // [property: string]: any;
}

/**
 * 加油机信息
 */
export interface DeviceInfo {
    /** 加油机名称 */
    tankerName: string
    /**
     * 厂家名称
     */
    factoryName: string
    /**
     * 出厂编号
     */
    factoryNum: string
    /**
     * 出厂日期
     */
    factoryTime: string | null
    /**
     * 加油枪信息
     */
    gunBindingList: GunBindingList[]
    /**
     * 油机枪数
     */
    gunNum: number
    /**
     * 注册的加油机id
     */
    id?: number
    /**
     * 是否连接编码器，0否 1是
     */
    linkGunOff: string
    /**
     * 是否连接枪开关，0否 1是
     */
    linkPulse: string
    /**
     * 加油机设备编号
     */
    skDeviceSn: string
    [property: string]: any
}

export interface GunBindingList {
    /**
     * 加油枪名称
     */
    gunName?: string
    /**
     * 油枪编号
     */
    gunNo: number | string
    /**
     * 油品
     */
    oilVariety: string
    /**
     * 编码器系数(编码器当量)
     */
    pulseCoefficient: number
    /**
     * 编码器通道号(编码器通道)
     */
    pulsePortNo: string
    /**
     * 税控内枪号
     */
    skMapGunNo: string
    /**
     * 税控端口号(主板通道)
     */
    skPortNo: string
    [property: string]: any
}

/**
 * 加油站信息
 */
export interface FuelStation {
    id?: number | string
    /**
     * 市id
     */
    city: string
    /**
     * 县区id
     */
    county: string
    /**
     * 社会信用代码
     */
    creditCode: string
    /**
     * 纬度
     */
    lat?: string
    /**
     * 经度
     */
    lng?: string
    /**
     * 加油站名称
     */
    name: string
    /**
     * 省id
     */
    province: string
    /**
     * 联系电话
     */
    telephone: string
    /** 油站类别 */
    groupId: number | string | null
    /** 油站地址 */
    address: string
    [property: string]: any
}

/**
 * 注册结果
 */
export interface RegisterResultData {
    /**
     * 4G模块信号强度
     */
    sk4gFirmwareVer: string
    /**
     * 物联网iccid
     */
    sk4gImei: string
    /**
     * 4G固件版本
     */
    sk4gSignalIntensity: string
    /**
     * MCU版本
     */
    skMcuFirmwareVer: string
    /**
     * 物联网IMEI
     */
    skSimCcid: string
    gunNo?: number //枪号
    msg?: string //报警内容
    status?: string //状态
    createTime?: string //报警时间
    recoveryTime?: string //恢复时间
}

/**
 * 加油站信息表单类型
 */
export interface StationInfoFormData {
    /** * 省id */
    province?: string
    /** * 市id */
    city?: string
    /** * 县区id */
    county?: string
    /** 街道 */
    town?: string
    /** 区域编码 */
    areaCode?: string | Array<string> | null
    /** * 社会信用代码 */
    creditCode: string
    /** * 加油站名称 */
    name: string
    /** * 联系电话 */
    telephone: string
    coordinate?: string
    /** 油站地址 */
    address: string
    groupId: number | string | null
}

export interface DeviceParams {
    /** 设备编码（非首次注册时，传旧设备编码） */
    deviceSn?: string
    /** 是否首次注册 0否 1是 */
    isFirst?: string
    /** 加油站id（非必传） */
    siteId?: string | number
}
