import { type Virtualizer } from '@tanstack/react-virtual';

import { type AnyTable } from '../AutoneGrid.types';

export type GridContextValue = {
  mode: 'fixed' | 'dynamic';
  scrollElement: HTMLDivElement | null;
  table: AnyTable;
  rowVirtualiser: Virtualizer<HTMLDivElement, Element>;
  columnVirtualiser: Virtualizer<HTMLDivElement, Element>;
  rowWidth: number;
  headerHeight: number;
  footerHeight: number;
  leftPinnedAreaWidth: number;
  rightPinnedAreaWidth: number;
};
