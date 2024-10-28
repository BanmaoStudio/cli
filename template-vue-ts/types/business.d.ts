import type { DataTableColumns } from 'naive-ui';

/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   * - custom: 自定义角色
   */
  type RoleType = keyof typeof import("@/enums").EnumUserRole;

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    userId: number | null;
    /** 用户角色类型 */
    userRole: RoleType;
    /** 区域编码 */
    areaCode?: number;
    /** 区域名称 */
    areaName?: string;
    /** 是否为管理员 */
    isAdmin?: number;
    /** 账号等级 */
    level?: number;
    /** 登录ip */
    loginIp?: string;
    /** 登录时间 */
    loginTime?: string;
    /** 用户名 */
    name?: string;
    /** 登录账号 */
    username: string;
  }
}

declare namespace NoxTable {
  interface Columns extends DataTableColumns {
    valueType: 'select' | 'text' | 'date';
    valueEnum: { [key: string]: string };
    hideInSearch: boolean;
    hideInTable: boolean;
    hideInForm: boolean;
  }
}
