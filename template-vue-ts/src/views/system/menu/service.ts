import { post } from '@/utils/request'

enum Api {
    // 菜单列表
    MenuList = 'menu/list',
    // 上级菜单集合
    MenuOptions = 'menu/option',
    // 添加菜单
    AddMenu = 'menu/add',
    // 修改菜单
    EditMenu = 'menu/edit',
    // 删除账号
    DeleteMenu = 'menu/delete'
}

export function fetchDataList() {
    return post<any>({
        url: Api.MenuList
    })
}
export function fetchMenuOptions() {
    return post<any>({
        url: Api.MenuOptions
    })
}
export function fetchAddMenu(data: any) {
    return post<any>({
        url: Api.AddMenu,
        data
    })
}
export function fetchEditMenu(data: any) {
    return post<any>({
        url: Api.EditMenu,
        data
    })
}

export function fetchDeleteMenu(id: number) {
    return post<any>({
        url: Api.DeleteMenu,
        data: { id }
    })
}
