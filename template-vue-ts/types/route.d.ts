declare namespace AuthRoute {
  /** 路由控制 */
  interface RouteMeta {
    /** 路由标题（可用来做document.title或者菜单的名称） */
    title: string;
    /** 需要登录权限 */
    requiresAuth?: boolean;
    /**
     * 哪些类型的用户有权限才能访问的路由（空则表示不需要权限）
     * @description 后端动态路由不需要该属性，直接由后端根据用户角色返回对应权限的路由数据
     */
    permissions?: Auth.RoleType[];
    /** 缓存页面 */
    keepAlive?: boolean;
    /** 菜单对应图标 */
    icon?:
      | string
      | (() => JSX.Element | VNodeChild)
      | FunctionalComponent<SVGAttributes, {}>;
    /** 是否在菜单中隐藏（一些列表、表格的详情页需要通过参数跳转，所以不能显示在菜单中） */
    hide?: boolean;
    /** 外链接 */
    href?: string;
    /** 是否支持多个tab页签（默认一个，即相同name的路由会被替换） */
    multiTab?: boolean;
    /** 路由顺序，可用于菜单的排序 */
    order?: number;
    /** 当前路由需要选中的菜单项(用于跳转至不在左侧菜单显示的路由且需要高亮某个菜单的情况) */
    activeMenu?: RouteKey;
    /** 是否固定在 tab 卡不可关闭 */
    affix?: boolean;
  }

  type Route<K extends AllRouteKey = AllRouteKey> = K extends AllRouteKey
    ? {
        /** 路由名称(路由唯一标识) */
        name: K;
        /** 路由路径 */
        path: AuthRouteUtils.GetRoutePath<K>;
        /** 路由重定向 */
        redirect?: AuthRouteUtils.GetRoutePath;
        /**
         * 路由组件
         * - basic: 基础布局，具有公共部分的布局
         * - blank: 空白布局
         * - multi: 多级路由布局(三级路由或三级以上时，除第一级路由和最后一级路由，其余的采用该布局)
         * - self: 作为子路由，使用自身的布局(作为最后一级路由，没有子路由)
         */
        component?: RouteComponentType;
        /** 子路由 */
        children?: Route[];
        /** 路由描述 */
        meta: RouteMeta<RoutePath<K>>;
      } & Omit<
        import("vue-router").RouteRecordRaw,
        "name" | "path" | "redirect" | "component" | "children" | "meta"
      >
    : never;

  /** 前端导入的路由模块 */
  type RouteModule = Record<string, { default: Route }>;
}
