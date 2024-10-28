export interface RequestOptions {
  isTransformResponse?: boolean;
}

export interface IResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}
