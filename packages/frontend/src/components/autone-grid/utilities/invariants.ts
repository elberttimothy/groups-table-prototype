import { type ColumnDef, type RowData } from '@tanstack/react-table';

export type UngroupedColumnDef<TData extends RowData> = ColumnDef<TData> & {
  __brand: 'ungrouped';
};

/**
 * Assert that the columns do not contain any group column defs.
 *
 * This is essential for the grid to work correctly so we need to assert this as the grid's
 * runtime invariant.
 */
export const assertNoGroupColumnDefs = <TData extends RowData>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[],
) => {
  if (columns.some((column) => 'columns' in column)) {
    const groupedColumnDefs = columns.filter((column) => 'columns' in column);
    throw new Error(
      'Expected no group column defs, but got ' +
        groupedColumnDefs.length +
        ' grouped column defs: ' +
        groupedColumnDefs.map((column) => column.id).join(', '),
    );
  }

  return columns as UngroupedColumnDef<TData>[];
};
