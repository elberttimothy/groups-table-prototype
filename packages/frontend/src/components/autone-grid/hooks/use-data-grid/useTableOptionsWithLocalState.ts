import { type ColumnOrderState, type RowData, type VisibilityState } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { type TableOptionsWithoutInitialState } from './useDataGrid.types';

export const useTableOptionsWithLocalState = <TData extends RowData>({
  columns,
  state,
  onColumnOrderChange,
  onColumnVisibilityChange,
  ...tableOptions
}: TableOptionsWithoutInitialState<TData>) => {
  const columnIds = useMemo(() => columns.map((column) => column.id ?? ''), [columns]);

  const [localColumnOrder, setLocalColumnOrder] = React.useState<ColumnOrderState>(columnIds);
  const [localColumnVisibility, setLocalColumnVisibility] = React.useState<VisibilityState>(
    Object.fromEntries(columnIds.map((columnId) => [columnId, true]))
  );

  return useMemo(() => {
    return {
      ...tableOptions,
      columns,
      state: {
        columnOrder: state?.columnOrder ?? localColumnOrder,
        columnVisibility: state?.columnVisibility ?? localColumnVisibility,
        ...state,
      },
      onColumnOrderChange: onColumnOrderChange ?? setLocalColumnOrder,
      onColumnVisibilityChange: onColumnVisibilityChange ?? setLocalColumnVisibility,
    };
  }, [
    tableOptions,
    columns,
    state,
    onColumnOrderChange,
    onColumnVisibilityChange,
    localColumnOrder,
    localColumnVisibility,
  ]);
};
