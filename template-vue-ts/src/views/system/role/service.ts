import { post } from '@/utils/request'

enum Api {
    // 获取所有菜单
    AllRule = 'menus/getAllRule',
    // 角色列表
    RoleList = 'roleMenu/getRoleList',
    // 添加角色
    AddRole = 'roleMenu/addRole',
    // 修改角色
    UpdateRole = 'roleMenu/updateRole',
    // 删除账号
    DeleteRole = 'roleMenu/deleteRole'
}

export function fetchAllRule() {
    return post<any>({
        url: Api.AllRule
    })
}
export function fetchDataList(data: any) {
    return post<any>({
        url: Api.RoleList,
        data
    })
}

export function fetchAddRole(data: any) {
    return post<any>({
        url: Api.AddRole,
        data
    })
}
export function fetchUpdateRole(data: any) {
    return post<any>({
        url: Api.UpdateRole,
        data
    })
}

export function fetchDeleteRole(roleId: number) {
    return post<any>({
        url: Api.DeleteRole,
        data: { roleId }
    })
}
