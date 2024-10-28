import { get, post } from "@/utils/request";
import type { LoginRequestProps, LoginResponse } from "./types";

enum API {
  /** 登录接口 */
  Login = "/user/login",
  /** 退出登录 */
  Logout = "/user/logout",
  /** 验证码 */
  Captcha = "/user/verifyCode",
}

/**
 * 登录接口数据
 * @param data - { username: string; password: string; captchaKey: string; captcha: string; }
 * @returns
 */
export function fetchLogin(data: LoginRequestProps) {
  return post<ResponseData<LoginResponse>>({
    url: API.Login,
    data,
  });
}

/**
 * 获取图形验证码
 */
export function fetchCaptcha() {
  return get<ResponseData<any>>({
    url: API.Captcha,
  });
}

/**
 * 退出登录
 * @param username - 用户名称 string | number
 * @returns
 */
export function fetchLogout(username: string | number) {
  return post<ResponseData<LoginResponse>>({
    url: API.Logout,
    data: {
      username,
    },
  });
}
