export interface Account {
    /** * 创建时间 */
    createTime: number | null
    /** * 状态 */
    status: string
    /** * id */
    id: number | null
    /** * 名称 */
    name: string
    /** * 用户名 */
    username?: string
    /** * 角色id */
    roleIds?: any
    roleNames?: any
    /** * 维度 */
    lat?: string
    /** * 经度 */
    lng?: string
    password?: any
    key?: string
}
export interface Role {
    /** * roleId */
    roleId: number | null
    /** * 角色名称 */
    roleName: string
    /** * 角色排序 */
    roleSort: number | null
    /** * 角色状态 */
    status: string
    /** * 菜单组 */
    menuIds?: string
    /** * 备注 */
    remark?: string
}

export interface AccountRequest extends PaginationRequestProps {
    name?: string
    username?: string
}

export type AccountForm = Omit<Account, 'createTime'>
