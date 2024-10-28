
export type PackageType = '0' | '1';

export interface VersionListRequest {
  pageNum: number;
  pageSize: number;
}

export interface VersionListItem {
  /** id */
  id: number;
  /** type of firmware package, 0:mcu 1:4g */
  type: PackageType;
  /** version */
  version: string;
  /** firmware package url */
  url: string;
  /** status */
  status: string;
  /** remark */
  remark?: string;
  /** create time */
  createTime: string;
  /** update time */
  updateTime: string;
}

export type PackageForm = Omit<VersionListItem, "createTime" | "updateTime">;
