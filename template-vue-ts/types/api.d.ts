// 后端接口返回的数据类型

/** 后端返回的用户权益相关类型 */
declare namespace ApiAuth {
  /** 返回的token 和刷新token */
  interface Token {
    token: string;
  }
  /** 返回的用户信息 */
  type UserInfo = Auth.UserInfo;
}

declare interface PaginationRequestProps {
  page: number;
  pageSize: number;
}

declare interface PaginationType {
  page: number;
  pageSize: number;
  total: number;
}
