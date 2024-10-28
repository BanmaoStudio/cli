import { get, post } from '@/utils/request'
import type { AccountRequest, Account, Role } from './types'

enum Api {
    // 账号列表
    DataList = 'cpyUser/list',
    // 所有角色
    AllRole = 'roleMenu/getAllRole',
    // 新增账号
    SaveAccount = 'cpyUser/add',
    // 修改账号
    EditAccount = 'cpyUser/edit',
    // 重置账号密码
    EditPassword = 'cpyUser/editPassword',
    // 删除账号
    DeleteData = 'cpyUser/delete',
    // 获取密码加密key
    PassKey = 'user/getPassKey'
}

export function fetchPassKey() {
    return get<any>({
        url: Api.PassKey
    })
}
export function fetchAllRole() {
    return post<ResponseData<Role>>({
        url: Api.AllRole
    })
}

export function saveAccountData(data: Omit<Account, 'createTime' | 'id'>) {
    return post<ResponseData<any>>({
        url: Api.SaveAccount,
        data
    })
}
export function fetchDataList(data: AccountRequest) {
    return post<ResponseDataList<Account>>({
        url: Api.DataList,
        data
    })
}
export function editAccountData(data: Omit<Account, 'createTime'>) {
    return post<ResponseData<any>>({
        url: Api.EditAccount,
        data
    })
}

export function deleteAccount(id: number) {
    return post<ResponseData<any>>({
        url: Api.DeleteData,
        data: { id }
    })
}
export function editPasswordData(data: any) {
    return post<ResponseData<any>>({
        url: Api.EditPassword,
        data
    })
}
