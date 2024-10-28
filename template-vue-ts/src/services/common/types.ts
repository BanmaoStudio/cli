export interface AreaCodeItem {
  /** ID */
  id: number;
  /** 上级编码 */
  pid: string;
  /** 区域名称 */
  name: string;
  /** 区域编码 */
  code: string;
}

export interface AreaCodeItemWithoutAuth {
  id: number;
  name: string;
  code: string;
  pid: number;
  children: AreaCodeItemWithoutAuth[];
}
