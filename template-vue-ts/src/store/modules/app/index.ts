import { nextTick } from "vue";
import { defineStore } from "pinia";

interface AppState {
  /** 重载页面（控制页面的显示） */
  reloadFlag: boolean;
  /** 是否显示主题设置抽屉 */
  settingDrawerVisible: boolean;
}

export const useAppStore = defineStore("app-store", {
  state: (): AppState => ({
    reloadFlag: true,
    settingDrawerVisible: false,
  }),
  actions: {
    async reloadPage(duration = 0) {
      this.reloadFlag = false;
      await nextTick();
      if (duration) {
        setTimeout(() => {
          this.reloadFlag = true;
        }, duration);
      } else {
        this.reloadFlag = true;
      }

      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 });
      }, 100);
    },
    /** 打开设置抽屉 */
    openSettingDrawer() {
      this.settingDrawerVisible = true;
    },
    /** 关闭设置抽屉 */
    closeSettingDrawer() {
      this.settingDrawerVisible = false;
    },
    /** 切换抽屉可见状态 */
    toggleSettingDrawerVisible() {
      this.settingDrawerVisible = !this.settingDrawerVisible;
    },
  },
});
