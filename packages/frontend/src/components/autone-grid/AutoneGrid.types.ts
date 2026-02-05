/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type Cell,
  type Column,
  type ColumnDef,
  type GroupColumnDef,
  type Header,
  type HeaderGroup,
  type Row,
  type Table,
} from '@tanstack/react-table';

export type AnyTable = Table<any>;
export type AnyColumn = Column<any, any>;
export type AnyColumnDef = ColumnDef<any, any>;
export type AnyHeader = Header<any, any>;
export type AnyHeaderGroup = HeaderGroup<any>;
export type AnyRow = Row<any>;
export type AnyCell = Cell<any, any>;
export type AnyGroupColumnDef = GroupColumnDef<any, any>;
