import type { App } from 'vue'
import { createPinia, defineStore } from 'pinia'
// import { resetSetupStore } from './plugins'

export function setupStore(app: App) {
    const store = createPinia()
    // store.use(resetSetupStore);

    app.use(store)
}
// 定义 State 的接口
interface StationState {
    formData: {
        [key: string]: any
        skDeviceSn?: string
    }
}

export const useStationStore = defineStore('station', {
    state: (): StationState => ({
        formData: {}
    }),
    getters: {
        getFormData: (state) => state.formData
    },
    actions: {
        setFormData(formData: StationState['formData']) {
            this.formData = formData
        },
        setSkDeviceSn(skDeviceSn: string) {
            this.formData.skDeviceSn = skDeviceSn
        }
    }
})
export * from './modules'
// export * from './subscribe'
