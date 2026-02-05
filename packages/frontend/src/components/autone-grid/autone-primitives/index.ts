import '../AutoneGrid.css';

import { Body } from './Body';
import { Cell, DynamicCell } from './Cell';
import { ColumnDragOverlay } from './ColumnDragOverlay';
import { Container } from './Container';
import { Footer } from './Footer';
import { FooterCell } from './FooterCell';
import { FooterRow } from './FooterRow';
import { Header } from './Header';
import { HeaderCell } from './HeaderCell';
import { HeaderRow } from './HeaderRow';
import { InfiniteScrollSentinel } from './InfiniteScrollSentinel';
import { Pagination } from './Pagination';
import {
  CenterBodyGroup,
  CenterFooterGroup,
  CenterHeaderGroup,
  LeftBodyGroup,
  LeftFooterGroup,
  LeftHeaderGroup,
  RightBodyGroup,
  RightFooterGroup,
  RightHeaderGroup,
} from './PinningGroups';
import {
  DynamicRowPreset,
  DynamicRowWithCellsPreset,
  HeaderPreset,
  HeaderWithCellsPreset,
  RowPreset,
  RowWithCellsPreset,
} from './Presets';
import { Root } from './Root';
import { DynamicRow, Row } from './Row';

export * from './ColumnDragHandle';

/**
 * Wrapped versions of the GridPrimitives with styling to match our design system + other autone-specific features. You
 * should be using these instead of the GridPrimitives directly.
 */
export const AutoneGrid = {
  Root,
  Header,
  Body,
  Footer,
  Cell,
  DynamicCell,
  HeaderRow,
  HeaderCell,
  FooterRow,
  FooterCell,
  Row,
  DynamicRow,
  LeftHeaderGroup,
  CenterHeaderGroup,
  RightHeaderGroup,
  LeftBodyGroup,
  CenterBodyGroup,
  RightBodyGroup,
  LeftFooterGroup,
  CenterFooterGroup,
  RightFooterGroup,
  InfiniteScrollSentinel,
  Container,
  Pagination,
  ColumnDragOverlay,
};

/**
 * Default presets for data grids with fixed height rows.
 */
export const AutoneGridPreset = {
  Container,
  Pagination,
  Root,
  Header: HeaderPreset,
  HeaderWithCells: HeaderWithCellsPreset,
  Body,
  Row: RowPreset,
  RowWithCells: RowWithCellsPreset,
  Cell,
  InfiniteScrollSentinel,
  ColumnDragOverlay,
};

/**
 * Default presets for data grids with dynamic row heights.
 */
export const AutoneGridDynamicPreset = {
  Container,
  Pagination,
  Root,
  Header: HeaderPreset,
  HeaderWithCells: HeaderWithCellsPreset,
  Body,
  Row: DynamicRowPreset,
  RowWithCells: DynamicRowWithCellsPreset,
  Cell: DynamicCell,
  InfiniteScrollSentinel,
  ColumnDragOverlay,
};
