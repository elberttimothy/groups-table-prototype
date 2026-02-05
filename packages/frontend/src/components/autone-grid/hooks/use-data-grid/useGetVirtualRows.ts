import { simpleMemoise } from '@/utils';
import { type RowData, type RowModel } from '@tanstack/react-table';
import { type Virtualizer } from '@tanstack/react-virtual';
import { useCallback } from 'react';

import {
  type CellRect,
  type RowRect,
  type VirtualCell,
  type VirtualRow,
} from './useDataGrid.types';

const createCellRect = simpleMemoise(
  (
    position: 'relative' | 'absolute',
    width: number,
    height: number,
    x: number,
  ): CellRect => {
    return {
      position,
      width,
      height,
      x,
    };
  },
);

const createRowRect = simpleMemoise(
  (position: 'relative' | 'absolute', height: number, y: number): RowRect => {
    return {
      position,
      height,
      y,
    };
  },
);

interface UseGetVirtualRowsProps<TData extends RowData> {
  rowModel: RowModel<TData>;
  columnVirtualiser: Virtualizer<HTMLDivElement, Element>;
  rowVirtualiser: Virtualizer<HTMLDivElement, Element>;
}

export const useGetVirtualRows = <TData extends RowData>({
  rowModel,
  columnVirtualiser,
  rowVirtualiser,
}: UseGetVirtualRowsProps<TData>) => {
  return useCallback(() => {
    return rowVirtualiser.getVirtualItems().map((virtualRow) => {
      const row = rowModel.rows[virtualRow.index];

      const leftVisibleCells = row.getLeftVisibleCells();
      const rightVisibleCells = row.getRightVisibleCells();
      const centerVisibleCells = row.getCenterVisibleCells();

      const leftPinnedCells = leftVisibleCells.map((cell) => {
        const cellRect: CellRect = createCellRect(
          'relative',
          cell.column.getSize(),
          virtualRow.size,
          0,
        );
        return {
          key: cell.id,
          cell,
          cellRect,
          index: cell.column.getIndex(),
        };
      }) satisfies VirtualCell[];

      const rightPinnedCells = rightVisibleCells.map((cell) => {
        const cellRect: CellRect = createCellRect(
          'relative',
          cell.column.getSize(),
          virtualRow.size,
          0,
        );
        return {
          key: cell.id,
          cell,
          cellRect,
          index: cell.column.getIndex(),
        };
      }) satisfies VirtualCell[];

      const virtualCenterVisibleCells = columnVirtualiser
        .getVirtualItems()
        .map((virtualColumn) => {
          const cell = centerVisibleCells[virtualColumn.index];

          const cellRect: CellRect = createCellRect(
            'absolute',
            virtualColumn.size,
            virtualRow.size,
            virtualColumn.start,
          );
          return {
            key: cell.id,
            index: cell.column.getIndex(),
            cell,
            cellRect,
          };
        }) satisfies VirtualCell[];

      const rowRect: RowRect = createRowRect(
        'absolute',
        virtualRow.size,
        virtualRow.start,
      );

      return {
        key: row.id,
        index: virtualRow.index,
        row,
        rowRect,
        cells: {
          left: leftPinnedCells,
          center: virtualCenterVisibleCells,
          right: rightPinnedCells,
        },
      };
    }) satisfies VirtualRow[];
  }, [rowModel, columnVirtualiser, rowVirtualiser]);
};
