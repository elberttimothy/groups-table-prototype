import { type Header, type RowData } from '@tanstack/react-table';
import { type Virtualizer } from '@tanstack/react-virtual';
import React from 'react';

import {
  type FooterGroup,
  type PinnedFooter,
  type VirtualFooter,
} from './useDataGrid.types';

interface UseGetVirtualFootersProps<TData extends RowData> {
  leftVisibleLeafFooters: Header<TData, unknown>[];
  centerVisibleLeafFooters: Header<TData, unknown>[];
  rightVisibleLeafFooters: Header<TData, unknown>[];
  footerHeight: number;
  columnVirtualiser: Virtualizer<HTMLDivElement, Element>;
}

export const useGetVirtualFooters = <TData extends RowData>({
  leftVisibleLeafFooters,
  centerVisibleLeafFooters,
  rightVisibleLeafFooters,
  footerHeight,
  columnVirtualiser,
}: UseGetVirtualFootersProps<TData>) => {
  return React.useCallback(() => {
    const leftVirtualFooters = leftVisibleLeafFooters.map((footer) => ({
      key: footer.id,
      footer,
      footerRect: {
        position: 'relative',
        width: footer.getSize(),
        height: footerHeight,
        left: 0,
        x: 0,
      },
    })) satisfies PinnedFooter[];
    const rightVirtualFooters = rightVisibleLeafFooters.map((footer) => ({
      key: footer.id,
      footer,
      footerRect: {
        position: 'relative',
        width: footer.getSize(),
        height: footerHeight,
        right: 0,
        x: 0,
      },
    })) satisfies PinnedFooter[];
    const centerVirtualFooters = columnVirtualiser
      .getVirtualItems()
      .map(
        (virtualItem) =>
          [virtualItem, centerVisibleLeafFooters[virtualItem.index]] as const,
      )
      .map(([virtualItem, virtualFooter]) => ({
        key: virtualFooter.id,
        footer: virtualFooter,
        index: virtualItem.index,
        footerRect: {
          position: 'absolute',
          height: footerHeight,
          width: virtualItem.size,
          x: virtualItem.start,
        },
      })) satisfies VirtualFooter[];

    return {
      left: leftVirtualFooters,
      center: centerVirtualFooters,
      right: rightVirtualFooters,
    } satisfies FooterGroup;
  }, [
    leftVisibleLeafFooters,
    centerVisibleLeafFooters,
    rightVisibleLeafFooters,
    footerHeight,
    columnVirtualiser,
  ]);
};
