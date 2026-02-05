import { type Header, type RowData } from '@tanstack/react-table';
import { type Virtualizer } from '@tanstack/react-virtual';
import React from 'react';

import {
  type HeaderGroup,
  type PinnedHeader,
  type VirtualHeader,
} from './useDataGrid.types';

interface UseGetVirtualHeadersProps<TData extends RowData> {
  leftVisibleLeafHeaders: Header<TData, unknown>[];
  centerVisibleLeafHeaders: Header<TData, unknown>[];
  rightVisibleLeafHeaders: Header<TData, unknown>[];
  headerHeight: number;
  columnVirtualiser: Virtualizer<HTMLDivElement, Element>;
}

export const useGetVirtualHeaders = <TData extends RowData>({
  leftVisibleLeafHeaders,
  centerVisibleLeafHeaders,
  rightVisibleLeafHeaders,
  headerHeight,
  columnVirtualiser,
}: UseGetVirtualHeadersProps<TData>) => {
  return React.useCallback(() => {
    const leftVirtualHeaders = leftVisibleLeafHeaders.map((header) => ({
      key: header.id,
      header,
      headerRect: {
        position: 'relative',
        width: header.getSize(),
        height: headerHeight,
        left: 0,
        x: 0,
      },
    })) satisfies PinnedHeader[];
    const rightVirtualHeaders = rightVisibleLeafHeaders.map((header) => ({
      key: header.id,
      header,
      headerRect: {
        position: 'relative',
        width: header.getSize(),
        height: headerHeight,
        right: 0,
        x: 0,
      },
    })) satisfies PinnedHeader[];
    const centerVirtualHeaders = columnVirtualiser
      .getVirtualItems()
      .map(
        (virtualItem) =>
          [virtualItem, centerVisibleLeafHeaders[virtualItem.index]] as const,
      )
      .map(([virtualItem, virtualHeader]) => ({
        key: virtualHeader.id,
        header: virtualHeader,
        index: virtualItem.index,
        headerRect: {
          position: 'absolute',
          height: headerHeight,
          width: virtualItem.size,
          x: virtualItem.start,
        },
      })) satisfies VirtualHeader[];

    return {
      left: leftVirtualHeaders,
      center: centerVirtualHeaders,
      right: rightVirtualHeaders,
    } satisfies HeaderGroup;
  }, [
    leftVisibleLeafHeaders,
    centerVisibleLeafHeaders,
    rightVisibleLeafHeaders,
    headerHeight,
    columnVirtualiser,
  ]);
};
