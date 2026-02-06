import { type RowData, type TableOptions } from '@tanstack/react-table';
import { type CSSProperties } from 'react';

import { type AnyCell, type AnyHeader, type AnyRow } from '../../AutoneGrid.types';
import { type UngroupedColumnDef } from '../../utilities/invariants';

export type TableOptionsWithoutInitialState<TData extends RowData> = Omit<
  TableOptions<TData>,
  'initialState' | 'columns' | 'getCoreRowModel'
> & {
  columns: UngroupedColumnDef<TData>[];
};

// =================== HEADER TYPES ===================
export type HeaderRect = {
  position: CSSProperties['position'];
  height: number;
  width: number;
  x: number;
};

export type PinnedHeader = {
  key: string;
  header: AnyHeader;
  headerRect: HeaderRect;
};

export type VirtualHeader = PinnedHeader & {
  index: number;
};

export type HeaderGroup = {
  left: PinnedHeader[];
  center: VirtualHeader[];
  right: PinnedHeader[];
};

// =================== FOOTER TYPES ===================
export type FooterRect = {
  position: CSSProperties['position'];
  height: number;
  width: number;
  x: number;
};

export type PinnedFooter = {
  key: string;
  footer: AnyHeader;
  footerRect: FooterRect;
};

export type VirtualFooter = PinnedFooter & {
  index: number;
};

export type FooterGroup = {
  left: PinnedFooter[];
  center: VirtualFooter[];
  right: PinnedFooter[];
};

// =================== CELL TYPES ===================
export type CellRect = {
  position: CSSProperties['position'];
  height: CSSProperties['height'];
  width: number;
  x: number;
};

export type VirtualCell = {
  key: string;
  cell: AnyCell;
  cellRect: CellRect;
  index: number;
};

export type RowRect = {
  position: CSSProperties['position'];
  height: CSSProperties['height'];
  y: number;
};

export type RegionWidths = {
  left: number;
  center: number;
  right: number;
};

export type VirtualRow = {
  key: string;
  index: number;
  row: AnyRow;
  rowRect: RowRect;
  cells: {
    left: VirtualCell[];
    center: VirtualCell[];
    right: VirtualCell[];
  };
};
