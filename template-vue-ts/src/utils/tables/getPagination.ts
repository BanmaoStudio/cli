const pageSizes = [
  { label: "10 每页", value: 10 },
  { label: "20 每页", value: 20 },
  { label: "30 每页", value: 30 },
  { label: "40 每页", value: 40 },
];

/**
 * 转换分页字段名
 * @param pagination - { page: 当前页, total: 总条数, pageSize: 分页数量 } 服务端返回的分页数据
 */
export function getPagination(pagination: ResponsePaginationData) {
  // const pageCount: number = pagination.total / pagination.pageSize;

  return {
    // displayOrder: ['quick-jumper', 'pages', 'size-picker'],
    displayOrder: ["pages"],
    page: pagination.page || 1,
    itemCount: pagination.total || 0,
    // pageCount: pageCount,
    // pageCount: pageCount,
    defaultPage: 1,
    defaultItemCount: pagination.total,
    pageSize: pagination.pageSize || 10,
    showSizePicker: true,
    // showQuickJumper: true,
    // goto() {
    //   return '跳转到'
    // },
    // pageSizes: pageSizes,
    prefix() {
      return `共 ${pagination.total} 条`;
    },
  };
}
