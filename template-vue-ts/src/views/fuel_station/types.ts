export interface FuelStationItem {
    /** 加油站id */
    id: number
    /** 加油站名称 */
    name: string
    /** 社会信用代码 */
    creditCode: string
    /** 法人代表 */
    legal: string
    /** 电话 */
    telephone: string
    /** 端口数量 */
    dutyPortNum: number
    /** 加油机数量 */
    machineNum: number
    /** 油罐数量 */
    tankNum: number
    /** 加油站状态，1:营业 2:未营业 */
    state: number
    /** 经营地址 */
    address: string
}

export interface FuelStationParams extends RequestPagination {
    /** 加油站名称 */
    name?: string
    pageNum: number
    pageSize: number
    /** 社会信用代码 */
    creditCode?: string
    /** 法人代表 */
    legal?: string
    /** 电话 */
    telephone?: string
    /** province */
    // province?: number;
    // city?: number;
    // county?: number;
}

export interface FuelStationForm extends Omit<FuelStationItem, 'id'> {
    id?: number
    peopleNum: number
    startDate: string
    /** 油站接口编号 */
    siteCode?: string
    groupId: string
    /** 成品油经营许可证 */
    oilBusinessImg: string
    /** 危化品经营许可证 */
    chemicalsBusinessImg: string
    /** 省code */
    province?: number
    /** 市code */
    city?: number
    /** 区code */
    county?: number
    town?: number
    /** 经度 */
    lng?: number
    /** 纬度 */
    lat?: number
    /** 登记注册类型 */
    registerType?: string
}
