import { Body } from './Body';
import { Cell, DynamicCell } from './Cell';
import { Footer } from './Footer';
import { FooterCell } from './FooterCell';
import { FooterRow } from './FooterRow';
import { Header } from './Header';
import { HeaderCell } from './HeaderCell';
import { HeaderRow } from './HeaderRow';
import { CenterGroup, LeftPinnedGroup, RightPinnedGroup } from './PinningGroups';
import { Root } from './Root';
import { DynamicRow, Row } from './Row';

/**
 * Low-level primitives for our data grid component handling the raw DOM elements, positioning, and accessibility.
 *
 * These come with no "aesthetic" styling - only the minimal set of CSS needed to get the grid layout working.
 */
export const GridPrimitives = {
  Root,
  Header,
  Body,
  Footer,
  Cell,
  DynamicCell,
  LeftPinnedGroup,
  RightPinnedGroup,
  CenterGroup,
  HeaderRow,
  HeaderCell,
  FooterRow,
  FooterCell,
  Row,
  DynamicRow,
};
