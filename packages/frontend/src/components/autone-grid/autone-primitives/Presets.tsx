import { flexRender } from '@tanstack/react-table';
import React, { Fragment } from 'react';

import { useGridContext } from '../contexts/grid.context';
import {
  type FooterGroup,
  type HeaderGroup,
  type VirtualRow,
} from '../hooks/use-data-grid/useDataGrid.types';
import { type GridPrimitives } from '../primitives';

import { Body } from './Body';
import { Cell, DynamicCell } from './Cell';
import { Footer } from './Footer';
import { FooterCell } from './FooterCell';
import { FooterRow } from './FooterRow';
import { Header } from './Header';
import { HeaderCell } from './HeaderCell';
import { HeaderRow } from './HeaderRow';
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
import { DynamicRow, Row } from './Row';

export interface HeaderPresetProps {
  virtualHeaders: HeaderGroup;
  children: (headerItem: HeaderGroup['left' | 'center' | 'right'][number]) => React.ReactNode;
}

export const HeaderPreset = ({ virtualHeaders, children }: HeaderPresetProps) => {
  return (
    <Header>
      <HeaderRow>
        <LeftHeaderGroup>
          {virtualHeaders.left.map((headerItem) => (
            <Fragment key={headerItem.key}>{children(headerItem)}</Fragment>
          ))}
        </LeftHeaderGroup>
        <CenterHeaderGroup>
          {virtualHeaders.center.map((headerItem) => (
            <Fragment key={headerItem.key}>{children(headerItem)}</Fragment>
          ))}
        </CenterHeaderGroup>
        <RightHeaderGroup>
          {virtualHeaders.right.map((headerItem) => (
            <Fragment key={headerItem.key}>{children(headerItem)}</Fragment>
          ))}
        </RightHeaderGroup>
      </HeaderRow>
    </Header>
  );
};

export const HeaderWithCellsPreset = ({ virtualHeaders }: Omit<HeaderPresetProps, 'children'>) => {
  return (
    <HeaderPreset virtualHeaders={virtualHeaders}>
      {({ header, headerRect }) => (
        <HeaderCell
          columnId={header.column.id}
          colIndex={header.column.getIndex()}
          headerRect={headerRect}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </HeaderCell>
      )}
    </HeaderPreset>
  );
};

interface BodyPresetProps {
  virtualRows: VirtualRow[];
  highlightedRowIdOnMount?: string;
}

export const BodyPreset = ({ virtualRows, highlightedRowIdOnMount }: BodyPresetProps) => {
  const { table, rowVirtualiser } = useGridContext();

  React.useEffect(() => {
    if (highlightedRowIdOnMount) {
      const highlightedRowIndex = table.getRow(highlightedRowIdOnMount).index;
      setTimeout(() => {
        rowVirtualiser.scrollToIndex(highlightedRowIndex, {
          align: 'center',
          behavior: 'smooth',
        });
      });
    }
  }, [highlightedRowIdOnMount, rowVirtualiser, table]);

  return (
    <Body>
      {virtualRows.map(({ key, index, rowRect, cells, row }) => (
        <Row
          key={key}
          rowIndex={index}
          rowRect={rowRect}
          highlightOnMount={highlightedRowIdOnMount === row.id}
        >
          <LeftBodyGroup>
            {cells.left.map(({ key, cell, cellRect, index }) => (
              <Cell
                columnId={cell.column.id}
                rowIndex={index}
                key={key}
                colIndex={index}
                cellRect={cellRect}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Cell>
            ))}
          </LeftBodyGroup>
          <CenterBodyGroup>
            {cells.center.map(({ key, cell, cellRect, index }) => (
              <Cell
                columnId={cell.column.id}
                rowIndex={index}
                key={key}
                colIndex={index}
                cellRect={cellRect}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Cell>
            ))}
          </CenterBodyGroup>
          <RightBodyGroup>
            {cells.right.map(({ key, cell, cellRect, index }) => (
              <Cell
                columnId={cell.column.id}
                rowIndex={index}
                key={key}
                colIndex={index}
                cellRect={cellRect}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Cell>
            ))}
          </RightBodyGroup>
        </Row>
      ))}
    </Body>
  );
};

export const DynamicBodyPreset = ({ virtualRows, highlightedRowIdOnMount }: BodyPresetProps) => {
  const { table, rowVirtualiser } = useGridContext();

  React.useEffect(() => {
    if (highlightedRowIdOnMount) {
      const highlightedRowIndex = table.getRow(highlightedRowIdOnMount).index;
      setTimeout(() => {
        rowVirtualiser.scrollToIndex(highlightedRowIndex, {
          align: 'center',
          behavior: 'smooth',
        });
      });
    }
  }, [highlightedRowIdOnMount, rowVirtualiser, table]);

  return (
    <Body>
      {virtualRows.map(({ key, index, rowRect, cells, row }) => (
        <DynamicRow
          key={key}
          rowIndex={index}
          rowRect={rowRect}
          highlightOnMount={highlightedRowIdOnMount === row.id}
        >
          <LeftBodyGroup>
            {cells.left.map(({ key, cell, cellRect, index }) => (
              <DynamicCell
                columnId={cell.column.id}
                rowIndex={index}
                key={key}
                colIndex={index}
                cellRect={cellRect}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </DynamicCell>
            ))}
          </LeftBodyGroup>
          <CenterBodyGroup>
            {cells.center.map(({ key, cell, cellRect, index }) => (
              <DynamicCell
                columnId={cell.column.id}
                rowIndex={index}
                key={key}
                colIndex={index}
                cellRect={cellRect}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </DynamicCell>
            ))}
          </CenterBodyGroup>
          <RightBodyGroup>
            {cells.right.map(({ key, cell, cellRect, index }) => (
              <DynamicCell
                columnId={cell.column.id}
                rowIndex={index}
                key={key}
                colIndex={index}
                cellRect={cellRect}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </DynamicCell>
            ))}
          </RightBodyGroup>
        </DynamicRow>
      ))}
    </Body>
  );
};

export const FooterPreset = ({ virtualFooters }: { virtualFooters: FooterGroup }) => {
  return (
    <Footer>
      <FooterRow>
        <LeftFooterGroup>
          {virtualFooters.left.map(({ key, footer, footerRect }) => (
            <FooterCell
              key={key}
              columnId={footer.column.id}
              colIndex={footer.column.getIndex()}
              footerRect={footerRect}
            >
              {flexRender(footer.column.columnDef.footer, footer.getContext())}
            </FooterCell>
          ))}
        </LeftFooterGroup>
        <CenterFooterGroup>
          {virtualFooters.center.map(({ key, footer, footerRect }) => (
            <FooterCell
              key={key}
              columnId={footer.column.id}
              colIndex={footer.column.getIndex()}
              footerRect={footerRect}
            >
              {flexRender(footer.column.columnDef.footer, footer.getContext())}
            </FooterCell>
          ))}
        </CenterFooterGroup>
        <RightFooterGroup>
          {virtualFooters.right.map(({ key, footer, footerRect }) => (
            <FooterCell
              key={key}
              columnId={footer.column.id}
              colIndex={footer.column.getIndex()}
              footerRect={footerRect}
            >
              {flexRender(footer.column.columnDef.footer, footer.getContext())}
            </FooterCell>
          ))}
        </RightFooterGroup>
      </FooterRow>
    </Footer>
  );
};

export interface RowPresetProps<V extends VirtualRow> extends Omit<
  React.ComponentPropsWithoutRef<typeof GridPrimitives.Row>,
  'children' | 'rowIndex' | 'rowRect'
> {
  highlightOnMount?: boolean;
  isDisabled?: boolean;
  virtualRow: V;
  children: (cell: V['cells']['center' | 'left' | 'right'][number]) => React.ReactNode;
}

export const RowPreset = <V extends VirtualRow>({
  highlightOnMount,
  isDisabled,
  virtualRow,
  children,
  ...props
}: RowPresetProps<V>) => {
  return (
    <Row
      rowIndex={virtualRow.index}
      rowRect={virtualRow.rowRect}
      highlightOnMount={highlightOnMount}
      isDisabled={isDisabled}
      {...props}
    >
      <LeftBodyGroup>
        {virtualRow.cells.left.map((cell) => (
          <Fragment key={cell.key}>{children(cell)}</Fragment>
        ))}
      </LeftBodyGroup>
      <CenterBodyGroup>
        {virtualRow.cells.center.map((cell) => (
          <Fragment key={cell.key}>{children(cell)}</Fragment>
        ))}
      </CenterBodyGroup>
      <RightBodyGroup>
        {virtualRow.cells.right.map((cell) => (
          <Fragment key={cell.key}>{children(cell)}</Fragment>
        ))}
      </RightBodyGroup>
    </Row>
  );
};

export const RowWithCellsPreset = <V extends VirtualRow>({
  highlightOnMount,
  virtualRow,
  isDisabled,
  ...props
}: Omit<RowPresetProps<V>, 'children'>) => {
  return (
    <RowPreset
      highlightOnMount={highlightOnMount}
      virtualRow={virtualRow}
      isDisabled={isDisabled}
      {...props}
    >
      {({ cell, cellRect, index }) => (
        <Cell
          columnId={cell.column.id}
          rowIndex={virtualRow.index}
          colIndex={index}
          cellRect={cellRect}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Cell>
      )}
    </RowPreset>
  );
};

export const DynamicRowWithCellsPreset = <V extends VirtualRow>({
  highlightOnMount,
  virtualRow,
  ...props
}: Omit<RowPresetProps<V>, 'children'>) => {
  return (
    <DynamicRowPreset virtualRow={virtualRow} highlightOnMount={highlightOnMount} {...props}>
      {({ cell, cellRect, index }) => (
        <DynamicCell
          columnId={cell.column.id}
          rowIndex={virtualRow.index}
          colIndex={index}
          cellRect={cellRect}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </DynamicCell>
      )}
    </DynamicRowPreset>
  );
};

export const DynamicRowPreset = <V extends VirtualRow>({
  virtualRow,
  children,
  highlightOnMount,
  ...props
}: RowPresetProps<V>) => {
  return (
    <DynamicRow
      rowIndex={virtualRow.index}
      rowRect={virtualRow.rowRect}
      highlightOnMount={highlightOnMount}
      {...props}
    >
      <LeftBodyGroup>
        {virtualRow.cells.left.map((cell) => (
          <Fragment key={cell.key}>{children(cell)}</Fragment>
        ))}
      </LeftBodyGroup>
      <CenterBodyGroup>
        {virtualRow.cells.center.map((cell) => (
          <Fragment key={cell.key}>{children(cell)}</Fragment>
        ))}
      </CenterBodyGroup>
      <RightBodyGroup>
        {virtualRow.cells.right.map((cell) => (
          <Fragment key={cell.key}>{children(cell)}</Fragment>
        ))}
      </RightBodyGroup>
    </DynamicRow>
  );
};
