import {
  type CellContext,
  type HeaderContext,
  type Row,
  type RowData,
} from '@tanstack/react-table';
import { type ReactNode } from 'react';

import { Skeleton } from '@/atoms';

export const DataTableLoadingSymbol = Symbol('DataTableLoadingSymbol');

export interface DataTableLoadingObject {
  [DataTableLoadingSymbol]: true;
}

export const isDataTableLoadingObject = (val: unknown): val is DataTableLoadingObject => {
  return (
    val !== null &&
    typeof val === 'object' &&
    DataTableLoadingSymbol in val &&
    val[DataTableLoadingSymbol] === true
  );
};

export const createDataTableLoadingObject = <T extends object>(
  obj: T
): DataTableLoadingObject & T => {
  return {
    [DataTableLoadingSymbol]: true,
    ...obj,
  };
};

export type DataTableLoadingSymbolType = typeof DataTableLoadingSymbol;

interface ColumnCellGuardProps<TData, TValue, LoadingObject extends DataTableLoadingObject> {
  ctx: CellContext<TData, TValue>;
  renderCell: (
    ctx: CellContext<Exclude<TData, LoadingObject>, Exclude<TValue, LoadingObject>>
  ) => ReactNode;
  renderLoader?: (
    ctx: CellContext<Extract<TData, LoadingObject>, Extract<TValue, LoadingObject>>
  ) => ReactNode;
}

interface ColumnHeaderGuardProps<TData, TValue, LoadingObject extends DataTableLoadingObject> {
  ctx: HeaderContext<TData, TValue>;
  /**
   * If `all`, the header will be rendered as loading if all rows are loading.
   *
   * If `some`, the header will be rendered as loading if any row is loading.
   */
  mode?: 'all' | 'some';
  renderCell: (
    ctx: HeaderContext<Exclude<TData, LoadingObject>, Exclude<TValue, LoadingObject>>
  ) => ReactNode;
  renderLoader?: (
    ctx: HeaderContext<Extract<TData, LoadingObject>, Extract<TValue, LoadingObject>>
  ) => ReactNode;
}

/**
 * Create type-safe guard functions to facilitate declarative conditional rendering
 * of loading states in `Tanstack Table ColumnDefs`.
 *
 * Parameterise this factory function with two types:
 *
 * - `TData`: The type of the data in the table.
 * - `LoadingObject (optional)`: The type of the loading object.
 *
 * @example
 * ```tsx
 * type TData = {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * interface CustomLoadingObject extends DataTableLoadingObject {
 *   dataPayload: unknown;
 * }
 *
 * const {
 *  accessorFnGuard,
 *  columnCellGuard,
 *  columnHeaderGuard
 * } = createColumnLoadingGuards<TData, CustomLoadingObject>();
 * ```
 */
export const createColumnLoadingGuards = <
  TData extends RowData,
  LoadingObject extends DataTableLoadingObject = DataTableLoadingObject,
>() => {
  const areAllRowsLoadingMemo = new Map<Array<unknown>, boolean>();
  const areSomeRowsLoadingMemo = new Map<Array<unknown>, boolean>();

  const areAllRowsLoading = <T,>(rows: Row<T>[]) => {
    if (areAllRowsLoadingMemo.has(rows)) {
      return areAllRowsLoadingMemo.get(rows);
    }

    const result = rows.every((row) => isDataTableLoadingObject(row.original));
    areAllRowsLoadingMemo.set(rows, result);
    return result;
  };

  const areSomeRowsLoading = <T,>(rows: Row<T>[]) => {
    if (areSomeRowsLoadingMemo.has(rows)) {
      return areSomeRowsLoadingMemo.get(rows);
    }

    const result = rows.some((row) => isDataTableLoadingObject(row.original));
    areSomeRowsLoadingMemo.set(rows, result);
    return result;
  };

  /**
   * Guard an accessor function to prevent it from being called if the row is loading.
   */
  const accessorFnGuard = <TValue,>(accessorFn: (row: TData, index: number) => TValue) => {
    return (row: TData | LoadingObject, index: number): TValue | LoadingObject => {
      if (isDataTableLoadingObject(row)) {
        return row;
      } else {
        return accessorFn(row, index);
      }
    };
  };

  /**
   * Guard a column `renderCell` method to prevent it from being rendered if the row is
   * loading. Optionally, also provide a custom `renderLoader` method to render a custom loading
   * state.
   */
  const columnCellGuard = <GuardTData, GuardTValue>({
    ctx,
    renderCell,
    renderLoader = () => <Skeleton className="w-full h-full rounded-sm" />,
  }: ColumnCellGuardProps<GuardTData, GuardTValue, LoadingObject>): React.ReactNode => {
    return isDataTableLoadingObject(ctx.row.original)
      ? renderLoader(
          ctx as CellContext<
            Extract<GuardTData, LoadingObject>,
            Extract<GuardTValue, LoadingObject>
          >
        )
      : renderCell(
          ctx as CellContext<
            Exclude<GuardTData, LoadingObject>,
            Exclude<GuardTValue, LoadingObject>
          >
        );
  };

  /**
   * Guard a header `renderCell` method to prevent it from being rendered if the row is
   * loading. Optionally, also provide a custom `renderLoader` method to render a custom loading
   * state.
   *
   * @param ctx - The cell context from the table renderer
   * @param mode - `all` if all rows are loading, `some` if some rows are loading. Defaults to 'all'
   * @param renderCell - Function to render the actual cell content when not loading
   * @param renderLoader - Optional function to render custom loading state. Defaults to a skeleton component
   * @returns The rendered cell content or loading state based on the loading condition   */
  const columnHeaderGuard = <GuardTData, GuardTValue>({
    ctx,
    mode = 'all',
    renderCell,
    renderLoader = () => <Skeleton className="w-full h-full rounded-full bg-grey-20 opacity-50" />,
  }: ColumnHeaderGuardProps<GuardTData, GuardTValue, LoadingObject>): React.ReactNode => {
    const isHeaderCellLoading = mode === 'all' ? areAllRowsLoading : areSomeRowsLoading;

    return isHeaderCellLoading(ctx.table.getCoreRowModel().rows)
      ? renderLoader(
          ctx as HeaderContext<
            Extract<GuardTData, LoadingObject>,
            Extract<GuardTValue, LoadingObject>
          >
        )
      : renderCell(
          ctx as HeaderContext<
            Exclude<GuardTData, LoadingObject>,
            Exclude<GuardTValue, LoadingObject>
          >
        );
  };

  return {
    accessorFnGuard,
    columnCellGuard,
    columnHeaderGuard,
    areAllRowsLoading,
    areSomeRowsLoading,
  };
};
