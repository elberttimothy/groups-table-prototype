import {
  getCoreRowModel,
  type RowData,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useMemo } from 'react';

import { type AnyHeader } from '../../AutoneGrid.types';
import { getDynamicColumnWidths } from '../../utilities/dynamic-widths';

import { type TableOptionsWithoutInitialState } from './useDataGrid.types';
import { useGetVirtualFooters } from './useGetVirtualFooters';
import { useGetVirtualHeaders } from './useGetVirtualHeaders';
import { useGetVirtualRows } from './useGetVirtualRows';
import { useTableOptionsWithLocalState } from './useTableOptionsWithLocalState';

type UseDataGridOptions<TData extends RowData> =
  | {
      mode?: 'fixed';
      tableOptions: TableOptionsWithoutInitialState<TData>;
      headerHeight?: number;
      footerHeight?: number;
      rowHeight?: number;
      overscan?: {
        row: number;
        col: number;
      };
    }
  | {
      mode: 'dynamic';
      tableOptions: TableOptionsWithoutInitialState<TData>;
      headerHeight?: number;
      footerHeight?: number;
      estimateRowHeight: (index: number) => number;
      overscan?: {
        row: number;
      };
    };

const STABLE_EMPTY_HEADER_ARRAY: AnyHeader[] = [];

const DEFAULTS = {
  headerHeight: 40,
  footerHeight: 44,
  rowHeight: 48,
  overscan: {
    row: 5,
    col: 0,
  },
} as const;

/**
 * This hook encapsulates all virtualisation logic for `AutoneGrid`. It can operate under 2 modes:
 * - Fixed mode: When row heights are static and can be computed ahead of time.
 * - Dynamic mode: When row heights are variable and need to be measured on the fly.
 *
 * By default, the hook operates in fixed mode.
 *
 * When using `mode: 'dynamic'`, the hook turns off column virtualisation as row heights can vary based
 * on which columns are currently mounted. We do not want this behaviour. This is effectively turned off by
 * setting the overscan to the number of columns + 1. Remember to use `DynamicRow` and `DynamicCell` instead
 * of `Row` and `Cell`. The former 2 components internally call the virtualiser to measure their refs.
 */
export const useDataGrid = <TData extends RowData>(
  options: UseDataGridOptions<TData>,
) => {
  const [scrollElement, setScrollElement] =
    React.useState<HTMLDivElement | null>(null);

  const tableOptionsWithLocalState = useTableOptionsWithLocalState(
    options.tableOptions,
  );

  const tableOptions = useMemo(() => {
    return {
      manualPagination: true,
      ...tableOptionsWithLocalState,
      getCoreRowModel: getCoreRowModel(),
    };
  }, [tableOptionsWithLocalState]);

  const table = useReactTable(tableOptions);

  const numRows = table.getRowModel().rows.length;
  const numCols = table.getCenterVisibleLeafColumns().length;

  // ========================= HEADER/FOOTER GROUPS =========================
  // We get leaf headers directly because we assert that there are no group column defs.
  // Hence, we will always have a single header group just containing leaf headers.
  const centerVisibleLeafHeaders = table
    .getCenterLeafHeaders()
    .filter((header) => header.column.getIsVisible());
  const leftVisibleLeafHeaders = table
    .getLeftLeafHeaders()
    .filter((header) => header.column.getIsVisible());
  const rightVisibleLeafHeaders = table
    .getRightLeafHeaders()
    .filter((header) => header.column.getIsVisible());

  const centerVisibleLeafFooters =
    table.getCenterFooterGroups().at(0)?.headers ?? STABLE_EMPTY_HEADER_ARRAY;
  const leftVisibleLeafFooters =
    table.getLeftFooterGroups().at(0)?.headers ?? STABLE_EMPTY_HEADER_ARRAY;
  const rightVisibleLeafFooters =
    table.getRightFooterGroups().at(0)?.headers ?? STABLE_EMPTY_HEADER_ARRAY;

  // ========================= PADDINGS =========================
  const leftPinnedAreaWidth = useMemo(
    () =>
      leftVisibleLeafHeaders
        .filter((header) => header.column.getIsVisible())
        .reduce((acc, header) => acc + header.getSize(), 0),
    [leftVisibleLeafHeaders],
  );
  const rightPinnedAreaWidth = useMemo(
    () =>
      rightVisibleLeafHeaders.reduce(
        (acc, header) => acc + header.getSize(),
        0,
      ),
    [rightVisibleLeafHeaders],
  );

  // ========================= DYNAMIC COLUMN WIDTHS =========================
  const dynamicColumnWidths = useMemo(() => {
    const centerViewportWidth = scrollElement?.getBoundingClientRect().width
      ? scrollElement.getBoundingClientRect().width -
        leftPinnedAreaWidth -
        rightPinnedAreaWidth
      : null;
    return getDynamicColumnWidths(
      centerVisibleLeafHeaders,
      centerViewportWidth,
    );
  }, [
    centerVisibleLeafHeaders,
    scrollElement,
    leftPinnedAreaWidth,
    rightPinnedAreaWidth,
  ]);

  // ========================= VIRTUALISERS =========================
  const headerHeight = options.headerHeight ?? DEFAULTS.headerHeight;
  const footerHeight = options.footerHeight ?? DEFAULTS.footerHeight;
  const estimateRowHeight = React.useCallback(
    (index: number) => {
      if (options.mode === 'fixed' || options.mode === undefined) {
        return options.rowHeight ?? DEFAULTS.rowHeight;
      }
      if (options.mode === 'dynamic') {
        return options.estimateRowHeight(index);
      }
      return DEFAULTS.rowHeight;
    },
    [options],
  );

  const overscanConfig = useMemo(() => {
    if (options.mode === 'fixed') {
      return {
        row: options.overscan?.row ?? DEFAULTS.overscan.row,
        col: options.overscan?.col ?? DEFAULTS.overscan.col,
      };
    }
    // with dynamic row heights, we turn off column virtualisation by setting the overscan to the number of columns + 1
    // this is because the row heights can vary based on which cells are mounted and we don't want row
    // heights to change as users scroll in the x-axis
    return {
      row: options.overscan?.row ?? DEFAULTS.overscan.row,
      col: options.tableOptions.columns.length + 1,
    };
  }, [options]);

  const columnVirtualiser = useVirtualizer({
    count: numCols,
    getScrollElement: () => scrollElement,
    estimateSize: (index) => dynamicColumnWidths[index],
    horizontal: true,
    overscan: overscanConfig.col,
  });
  const rowVirtualiser = useVirtualizer({
    count: numRows,
    getScrollElement: () => scrollElement,
    estimateSize: estimateRowHeight,
    horizontal: false,
    overscan: overscanConfig.row,
  });

  // ========================= HEADERS =========================
  const getVirtualHeaders = useGetVirtualHeaders({
    leftVisibleLeafHeaders,
    centerVisibleLeafHeaders,
    rightVisibleLeafHeaders,
    headerHeight,
    columnVirtualiser,
  });

  // ========================= FOOTERS =========================
  const getVirtualFooters = useGetVirtualFooters({
    leftVisibleLeafFooters,
    centerVisibleLeafFooters,
    rightVisibleLeafFooters,
    footerHeight,
    columnVirtualiser,
  });

  // ========================= CELLS =========================
  const getVirtualRows = useGetVirtualRows({
    rowModel: table.getRowModel(),
    columnVirtualiser,
    rowVirtualiser,
  });

  // re-measure everytime scrollElement updates
  React.useLayoutEffect(() => {
    columnVirtualiser.measure();
    rowVirtualiser.measure();
  }, [scrollElement, columnVirtualiser, rowVirtualiser]);

  const centerAreaWidth = React.useMemo(
    () => dynamicColumnWidths.reduce((acc, width) => acc + width, 0),
    [dynamicColumnWidths],
  );

  const rowWidth = React.useMemo(
    () => centerAreaWidth + leftPinnedAreaWidth + rightPinnedAreaWidth,
    [centerAreaWidth, leftPinnedAreaWidth, rightPinnedAreaWidth],
  );

  return useMemo(
    () =>
      [
        setScrollElement,
        {
          getVirtualHeaders,
          getVirtualFooters,
          getVirtualRows,
        },
        {
          table,
          columnVirtualiser,
          rowVirtualiser,
          mode: options.mode ?? 'fixed',
          rowWidth,
          headerHeight,
          footerHeight,
          leftPinnedAreaWidth,
          rightPinnedAreaWidth,
        },
      ] as const,
    [
      getVirtualHeaders,
      getVirtualFooters,
      getVirtualRows,
      table,
      columnVirtualiser,
      rowVirtualiser,
      options.mode,
      rowWidth,
      headerHeight,
      footerHeight,
      leftPinnedAreaWidth,
      rightPinnedAreaWidth,
    ],
  );
};
