declare interface ResponseData<T> {
  status: number;
  msg: string;
  data: T;
}

declare interface ResponseDataList<T> {
  list: T[];
  total: number;
  pageSize: number;
  pageNum: number;
}

declare interface ResponsePaginationData extends PaginationRequestProps {
  /** 总条数 */
  total: number;
  pageSize: number;
  page: number;
}

declare interface NaivePaginationData {
  /** 当前页 */
  page: number;
  /** 总条数 */
  itemCount: number;
  /** 每页显示数量 */
  pageSize: number;
}

declare interface RequestPagination {
  pageNum: number;
  pageSize: number;
}
