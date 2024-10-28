import { post } from '@/utils/request'
import { LevelDataRequest, LevelDataItem } from './types'
enum Api {
    // 液位数据列表
    LevelDataList = 'tankRecord/list',
    // 液位数据历史详情
    HistoryDetails = 'tankRecord/history'
}

// 用于获取液位数据列表
export function fetchLevelDataList(data: LevelDataRequest) {
    return post<ResponseDataList<LevelDataItem>>({
        // 请求地址
        url: Api.LevelDataList,
        // 请求参数
        data
    })
}
// 液位数据历史详情
export function fetchHistoryDetails(data: LevelDataRequest) {
    return post<ResponseDataList<LevelDataItem>>({
        url: Api.HistoryDetails,
        data
    })
}
