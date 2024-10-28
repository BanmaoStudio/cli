export interface LoginRequestProps {
  username: string;
  password: string;
  verifyCode: string;
  key: string;
  captchaKey?: string;
}

export interface LoginResponse {
  /** 区域编码 */
  areaCode?: number;
  /** 区域名称 */
  areaName?: string;
  /** 账号等级 */
  level?: number;
  /** 登录ip */
  ip?: string;
  /** 登录时间 */
  loginTime?: string;
  /** 用户名 */
  name?: string;
  /** 请求接口token */
  token: string;
  /** 用户id */
  userId: number | null;
  /** 登录账号 */
  username: string;
  /** 角色 */
  roleId: number
}
