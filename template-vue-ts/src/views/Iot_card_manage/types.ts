export interface IotCardData {
    /**
     * 子卡详情
     */
    listPsimCards: ListPsimCard[]
    /**
     * 卡详情
     */
    vsimCardInfo: VsimCardInfo
    [property: string]: any
}

export interface ListPsimCard {
    /**
     * 定向配置，0：非定向卡
     * 1：状态正常
     * 2：状态查询失败
     * 100：新增处理中
     * 200：删除处理中
     * 300：新增失败
     * 400：删除失败
     */
    directionaConfig?: string
    /**
     * ICCID
     */
    iccid?: string
    /**
     * IMSI
     */
    imsi?: string[]
    /**
     * MSISDN
     */
    msisdn?: string[]
    /**
     * 在线状态，true：在线
     * false：不在线
     * null：未知
     */
    online?: string | null | Boolean
    /**
     * 具体状态，10：测试期
     * 20：静默期
     * 100：使用中
     * 150：部分使用中
     * 200：主动停用
     * 300：达量停用
     * 400：信控停用
     * 500：换绑停用
     * 600：实名停用
     * 700：异常停用
     * 40：已停机
     * 50：已销户
     */
    osStatus?: string
    /**
     * 累计流量
     */
    periodAddFlow?: string
    /**
     * 卡状态，10：可测试
     * 20：未使用
     * 30：使用中
     * 35：已停用
     * 40：已停机
     * 50：已销户
     */
    status?: string
    [property: string]: any
}

/**
 * 卡详情
 */
export interface VsimCardInfo {
    /**
     * ICCID
     */
    iccid?: string
    /**
     * 在线状态，true：在线
     * false：不在线
     * null：未知
     */
    online?: string | null | Boolean
    /**
     * 具体状态，10：测试期
     * 20：静默期
     * 100：使用中
     * 150：部分使用中
     * 200：主动停用
     * 300：达量停用
     * 400：信控停用
     * 500：换绑停用
     * 600：实名停用
     * 700：异常停用
     * 40：已停机
     * 50：已销户
     */
    osStatus?: string
    /**
     * 累计流量
     */
    periodAddFlow?: string
    /**
     * 卡状态，10：可测试
     * 20：未使用
     * 30：使用中
     * 35：已停用
     * 40：已停机
     * 50：已销户
     */
    status?: string
    [property: string]: any
}
