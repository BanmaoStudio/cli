import { EnumThemeTabMode, EnumThemeAnimateMode } from '@/enums'
import { defineStore } from 'pinia'

type ThemeState = Theme.Setting

function changeThemeMode(darkMode) {
    if (darkMode) {
        document.getElementsByTagName('html')[0].classList.add('dark')
    } else {
        document.getElementsByTagName('html')[0].classList.remove('dark')
    }
}

export const useThemeStore = defineStore('theme-store', {
    state: (): ThemeState => {
        return {
            darkMode: localStorage.getItem('darkMode') === 'dark',
            followSystemTheme: true,
            themeColor: localStorage.getItem('themeColor') || '#409eff',
            themeColorList: [
                {
                    label: '默认主题',
                    value: '#409eff'
                },
                {
                    label: '红色主题',
                    value: '#ef4444'
                },
                {
                    label: '绿色主题',
                    value: '#84cc16'
                },
                {
                    label: '黄色主题',
                    value: '#eab308'
                },
                {
                    label: '蓝色主题',
                    value: '#3b82f6'
                },
                {
                    label: '青色主题',
                    value: '#10b981'
                },
                {
                    label: '粉色主题',
                    value: '#f472b6'
                },
                {
                    label: '棕色主题',
                    value: '#a16241'
                },
                {
                    label: '紫色主题',
                    value: '#8b5cf6'
                },
                {
                    label: '橙色主题',
                    value: '#f97316'
                },
                {
                    label: '灰色主题',
                    value: '#909399'
                },
                {
                    label: '黑色主题',
                    value: '#303133'
                }
            ],
            tab: {
                visible: true,
                height: 40,
                mode: 'chrome',
                modeList: [
                    { value: 'chrome', label: EnumThemeTabMode['chrome'] },
                    { value: 'button', label: EnumThemeTabMode['button'] }
                ],
                isCache: true
            },
            header: {
                inverted: false,
                height: 64,
                crumb: {
                    visible: localStorage.getItem('showBreadcrumb') !== 'false',
                    showIcon: false
                }
            },
            sider: {
                inverted: false,
                width: 240,
                collapsedWidth: 64
            },
            page: {
                animate: true,
                animateMode: 'fade-slide',
                animateModeList: [
                    {
                        label: EnumThemeAnimateMode['fade-slide'],
                        value: 'fade-slide'
                    },
                    { label: EnumThemeAnimateMode['fade'], value: 'fade' },
                    {
                        label: EnumThemeAnimateMode['fade-bottom'],
                        value: 'fade-bottom'
                    },
                    {
                        label: EnumThemeAnimateMode['fade-scale'],
                        value: 'fade-scale'
                    },
                    {
                        label: EnumThemeAnimateMode['zoom-fade'],
                        value: 'zoom-fade'
                    },
                    {
                        label: EnumThemeAnimateMode['zoom-out'],
                        value: 'zoom-out'
                    }
                ]
            }
        }
    },
    getters: {
        /** 页面动画模式 */
        pageAnimateMode(state) {
            return state.page.animate ? state.page.animateMode : undefined
        }
    },
    actions: {
        setMultiTabbar(show: boolean) {
            this.tab.visible = show
        },
        setThemeColor(color: string) {
            this.themeColor = color
            localStorage.setItem('themeColor', color)
        },
        setShowBreadcrumb(show: boolean) {
            this.header.crumb.visible = show
            localStorage.setItem('showBreadcrumb', show.toString())
        },
        /** 切换/关闭 暗黑模式 */
        toggleDarkMode() {
            this.darkMode = !this.darkMode
            changeThemeMode(this.darkMode)
            localStorage.setItem('darkMode', this.darkMode ? 'dark' : 'light')
        },
        /** 设置暗黑模式 */
        setDarkMode(darkMode: boolean) {
            this.darkMode = darkMode
            changeThemeMode(darkMode)
            localStorage.setItem('darkMode', darkMode ? 'dark' : 'light')
        }
    }
})
