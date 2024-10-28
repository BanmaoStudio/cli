import { post } from '@/utils/request'
import { FuelDispenserFlowRequest, FuelDispenserFlowItem } from './types'
enum Api {
    // 加油机流水
    TankerRecordList = '/skTankerRecord/list'
}

// 用于加油机流水
export function fetchTankerRecordList(data: FuelDispenserFlowRequest) {
    return post<ResponseData<ResponseDataList<FuelDispenserFlowItem>>>({
        url: Api.TankerRecordList,
        data
    })
}
