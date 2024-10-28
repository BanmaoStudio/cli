export interface UpgradeManageRequest {
    /** 当前页 */
    pageNum?: string
    /** 每页的数量 */
    pageSize?: string
    /** 加油站名称 */
    siteName?: string
    // 固件包类型
    type?: string
}

export interface UpgradeManageItem {
    [property: string]: any
}
