import type { DataTableColumns } from 'naive-ui'

export interface ProTableColumns<T> extends DataTableColumns<T> {
  valueType?: 'select' | 'text' | 'date';
  hideInSearch?: boolean;
  hideInForm?: boolean;
  hideInTable?: boolean;
}

export interface ProTableInstance<T> {
  // ...
  reload: () => void;
  setColumns: (columns: ProTableColumns<T>[]) => void;
  setSearch: (search: any) => void;
  setForm: (form: any) => void;
  setPagination: (pagination: any) => void;
  setTableData: (tableData: T[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedRowKeys: (selectedRowKeys: string[]) => void;
  setSelectedRows: (selectedRows: T[]) => void;
  setRowSelection: (rowSelection: any) => void;
  setColumnsState: (state: any) => void;
}
