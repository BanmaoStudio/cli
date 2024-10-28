/** 枚举的key类型 */
declare namespace EnumType {
    /** 布局组件名称 */
    type LayoutComponentName =
        keyof typeof import('@/enums').EnumLayoutComponentName

    /** 布局模式 */
    type ThemeLayoutMode = keyof typeof import('@/enums').EnumThemeLayoutMode

    /** 多页签风格 */
    type ThemeTabMode = keyof typeof import('@/enums').EnumThemeTabMode

    /** 水平模式的菜单位置 */
    type ThemeHorizontalMenuPosition =
        keyof typeof import('@/enums').EnumThemeHorizontalMenuPosition

    /** 过渡动画 */
    type ThemeAnimateMode = keyof typeof import('@/enums').EnumThemeAnimateMode

    /** 登录模块 */
    // type LoginModuleKey = keyof typeof import('@/enums').EnumLoginModule;
}

/** 请求的相关类型 */
declare namespace Service {
    /** mock 示例接口类型：后端接口返回的数据的类型 */
    interface MockServiceResult<T = any> {
        /** 状态码 */
        code: string | number
        /** 接口数据 */
        data: T
        /** 接口消息 */
        msg: string
    }

    /** mock 的响应option */
    interface MockOption {
        url: Record<string, any>
        body: Record<string, any>
        query: Record<string, any>
        headers: Record<string, any>
    }
}

/** 主题相关类型 */
declare namespace Theme {
    export interface ThemeColorItem {
        label: string
        value: string
    }

    /** 主题配置 */
    interface Setting {
        /** 暗黑模式 */
        darkMode: boolean
        /** 是否自动跟随系统主题 */
        followSystemTheme: boolean
        /** 主题颜色 */
        themeColor: string
        /** 主题颜色列表 */
        themeColorList: ThemeColorItem[]
        /** 侧边栏样式 */
        sider: Sider
        /** 头部样式 */
        header: Header
        /** 多页签样式 */
        tab: Tab
        /** 页面样式 */
        page: Page
    }

    /** 其他主题颜色 */
    interface OtherColor {
        /** 信息 */
        info: string
        /** 成功 */
        success: string
        /** 警告 */
        warning: string
        /** 错误 */
        error: string
    }

    /** 头部样式 */
    interface Header {
        /** 头部反转色 */
        inverted: boolean
        /** 头部高度 */
        height: number
        /** 面包屑样式 */
        crumb: Crumb
    }
    /** 面包屑样式 */
    interface Crumb {
        /** 面包屑可见 */
        visible: boolean
        /** 显示图标 */
        showIcon: boolean
    }

    /** 标多页签样式 */
    export interface Tab {
        /** 多页签可见 */
        visible: boolean
        /** 多页签高度 */
        height: number
        /** 多页签风格 */
        mode: EnumType.ThemeTabMode
        /** 多页签风格列表 */
        modeList: ThemeTabModeList[]
        /** 开启多页签缓存 */
        isCache: boolean
    }

    /** 多页签风格列表 */
    interface ThemeTabModeList {
        value: EnumType.ThemeTabMode
        label: import('@/enums').EnumThemeTabMode
    }

    /** 侧边菜单栏 */
    interface Sider {
        /** 侧边栏反转色 */
        inverted: boolean
        /** 侧边栏宽度 */
        width: number
        /** 侧边栏折叠时的宽度 */
        collapsedWidth: number
    }

    /** 底部样式 */
    interface Footer {
        /** 底部高度 */
        height: number
        /** 底部是否可见 */
        visible: boolean
    }

    /** 页面样式 */
    interface Page {
        /** 页面是否开启动画 */
        animate: boolean
        /** 动画类型 */
        animateMode: EnumType.ThemeAnimateMode
        /** 动画类型列表 */
        animateModeList: AnimateModeList[]
    }

    /** 动画类型列表 */
    interface AnimateModeList {
        value: EnumType.ThemeAnimateMode
        label: import('@/enums').EnumThemeAnimateMode
    }
}

declare namespace App {
    /** 菜单项配置 */
    type GlobalMenuOption = import('naive-ui').MenuOption & {
        key: string
        label: string
        routeName: string
        routePath: string
        icon?: () => import('vue').VNodeChild
        children?: GlobalMenuOption[]
    }

    /** 面包屑 */
    type GlobalBreadcrumb = import('naive-ui').DropdownOption & {
        key: string
        label: string
        disabled: boolean
        routeName: string
        hasChildren: boolean
        children?: GlobalBreadcrumb[]
    }

    /** 多页签Tab的路由 */
    interface GlobalTabRoute
        extends Pick<
            import('vue-router').RouteLocationNormalizedLoaded,
            'name' | 'fullPath' | 'meta'
        > {
        /** 滚动的位置 */
        scrollPosition: {
            left: number
            top: number
        }
    }
}
