import { type Meta, type StoryObj } from '@storybook/react-vite';
import { flexRender } from '@tanstack/react-table';
import { useMemo } from 'react';

import { useDataGrid } from '../hooks/use-data-grid';
import { columns } from '../mocks/columns';
import { mockProducts } from '../mocks/mock-data';
import { variableColumns } from '../mocks/variable-content-columns';
import { variableMockProducts } from '../mocks/variable-content-mock-data';
import { GridPrimitives } from '../primitives';
import { assertNoGroupColumnDefs } from '../utilities/invariants';

// ========================= STORY META =========================

export default {
  title: 'Components/Autone Data Grid/Primitives',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

type Story = StoryObj;

// ========================= STORY =========================

export const FixedHeightRows: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: mockProducts,
        columns: assertNoGroupColumnDefs(columns),
        state: {
          columnPinning: {
            left: ['sku'],
            right: ['status'],
          },
        },
      },
      headerHeight: 44,
      footerHeight: 44,
      rowHeight: 48,
      overscan: {
        row: 0,
        col: 0,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <GridPrimitives.Root
        className="w-[700px] h-[450px] border bg-white shadow-sm"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        {/* Header */}
        <GridPrimitives.Header className="z-30 shadow-sm">
          <GridPrimitives.HeaderRow>
            <GridPrimitives.LeftPinnedGroup className="bg-white shadow-left-col z-30">
              {virtualHeaders.left.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.LeftPinnedGroup>
            <GridPrimitives.CenterGroup className="z-10">
              {virtualHeaders.center.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.CenterGroup>
            <GridPrimitives.RightPinnedGroup className="bg-white shadow-right-col z-30">
              {virtualHeaders.right.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.RightPinnedGroup>
          </GridPrimitives.HeaderRow>
        </GridPrimitives.Header>

        {/* Body */}
        <GridPrimitives.Body className="relative">
          {virtualRows.map(({ key, index, rowRect, cells }) => (
            <GridPrimitives.Row
              key={key}
              rowIndex={index}
              rowRect={rowRect}
              className="border-b hover:transition-colors"
            >
              {/* Left Pinned Cells */}
              <GridPrimitives.LeftPinnedGroup className="bg-white shadow-left-col w-fit z-30">
                {cells.left.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.LeftPinnedGroup>

              {/* Center Cells */}
              <GridPrimitives.CenterGroup>
                {cells.center.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.CenterGroup>

              {/* Right Pinned Cells */}
              <GridPrimitives.RightPinnedGroup className="bg-white shadow-right-col w-fit z-30">
                {cells.right.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.RightPinnedGroup>
            </GridPrimitives.Row>
          ))}
        </GridPrimitives.Body>
      </GridPrimitives.Root>
    );
  },
};

export const DynamicHeightRows: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'dynamic',
      tableOptions: {
        data: useMemo(() => variableMockProducts, []),
        columns: assertNoGroupColumnDefs(variableColumns),
        state: {
          columnPinning: {
            left: ['sku'],
            right: ['status'],
          },
        },
      },
      headerHeight: 44,
      footerHeight: 44,
      estimateRowHeight: () => 48,
      overscan: {
        row: 0,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <GridPrimitives.Root
        className="w-[700px] h-[450px] border bg-white shadow-sm"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        {/* Header */}
        <GridPrimitives.Header className="z-30 shadow-sm">
          <GridPrimitives.HeaderRow>
            <GridPrimitives.LeftPinnedGroup className="bg-white shadow-left-col z-30">
              {virtualHeaders.left.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.LeftPinnedGroup>
            <GridPrimitives.CenterGroup className="z-10">
              {virtualHeaders.center.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.CenterGroup>
            <GridPrimitives.RightPinnedGroup className="bg-white shadow-right-col z-30">
              {virtualHeaders.right.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.RightPinnedGroup>
          </GridPrimitives.HeaderRow>
        </GridPrimitives.Header>

        {/* Body */}
        <GridPrimitives.Body className="relative">
          {virtualRows.map(({ key, index, rowRect, cells }) => (
            <GridPrimitives.DynamicRow
              key={key}
              rowIndex={index}
              rowRect={rowRect}
              className="border-b hover:transition-colors"
            >
              {/* Left Pinned Cells */}
              <GridPrimitives.LeftPinnedGroup className="bg-white shadow-left-col w-fit z-30">
                {cells.left.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.DynamicCell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.DynamicCell>
                ))}
              </GridPrimitives.LeftPinnedGroup>

              {/* Center Cells */}
              <GridPrimitives.CenterGroup>
                {cells.center.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.DynamicCell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.DynamicCell>
                ))}
              </GridPrimitives.CenterGroup>

              {/* Right Pinned Cells */}
              <GridPrimitives.RightPinnedGroup className="bg-white shadow-right-col w-fit z-30">
                {cells.right.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.DynamicCell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.DynamicCell>
                ))}
              </GridPrimitives.RightPinnedGroup>
            </GridPrimitives.DynamicRow>
          ))}
        </GridPrimitives.Body>
      </GridPrimitives.Root>
    );
  },
};

// ========================= DYNAMIC COLUMN WIDTHS STORY =========================

// Narrow columns that will expand to fill the table width
const narrowColumns = assertNoGroupColumnDefs([
  columns[0], // sku - 100
  columns[1], // name - 220
  columns[3], // price - 100
  columns[4], // stock - 80
]); // Total: 500px, table is 700px wide

export const DynamicColumnWidths: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: mockProducts.slice(0, 50),
        columns: narrowColumns,
      },
      headerHeight: 44,
      footerHeight: 44,
      rowHeight: 48,
      overscan: {
        row: 0,
        col: 0,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <GridPrimitives.Root
        className="w-[700px] h-[450px] border bg-white shadow-sm"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        {/* Header */}
        <GridPrimitives.Header className="z-30 shadow-sm">
          <GridPrimitives.HeaderRow>
            <GridPrimitives.CenterGroup className="z-10">
              {virtualHeaders.center.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.CenterGroup>
          </GridPrimitives.HeaderRow>
        </GridPrimitives.Header>

        {/* Body */}
        <GridPrimitives.Body className="relative">
          {virtualRows.map(({ key, index, rowRect, cells }) => (
            <GridPrimitives.Row
              key={key}
              rowIndex={index}
              rowRect={rowRect}
              className="border-b hover:transition-colors"
            >
              {/* Center Cells */}
              <GridPrimitives.CenterGroup>
                {cells.center.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.CenterGroup>
            </GridPrimitives.Row>
          ))}
        </GridPrimitives.Body>
      </GridPrimitives.Root>
    );
  },
};

// ========================= WITH FOOTERS STORY =========================

export const WithFooters: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: mockProducts.slice(0, 100),
        columns: assertNoGroupColumnDefs(columns),
        state: {
          columnPinning: {
            left: ['sku'],
            right: ['status'],
          },
        },
      },
      headerHeight: 44,
      footerHeight: 44,
      rowHeight: 48,
      overscan: {
        row: 0,
        col: 0,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualFooters = gridState.getVirtualFooters();
    const virtualRows = gridState.getVirtualRows();

    return (
      <GridPrimitives.Root
        className="w-[700px] h-[450px] border bg-white shadow-sm"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        {/* Header */}
        <GridPrimitives.Header className="z-30 shadow-sm">
          <GridPrimitives.HeaderRow>
            <GridPrimitives.LeftPinnedGroup className="bg-white shadow-left-col z-30">
              {virtualHeaders.left.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.LeftPinnedGroup>
            <GridPrimitives.CenterGroup className="z-10">
              {virtualHeaders.center.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.CenterGroup>
            <GridPrimitives.RightPinnedGroup className="bg-white shadow-right-col z-30">
              {virtualHeaders.right.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.RightPinnedGroup>
          </GridPrimitives.HeaderRow>
        </GridPrimitives.Header>

        {/* Body */}
        <GridPrimitives.Body className="relative">
          {virtualRows.map(({ key, index, rowRect, cells }) => (
            <GridPrimitives.Row
              key={key}
              rowIndex={index}
              rowRect={rowRect}
              className="border-b hover:transition-colors"
            >
              {/* Left Pinned Cells */}
              <GridPrimitives.LeftPinnedGroup className="bg-white shadow-left-col w-fit z-30">
                {cells.left.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.LeftPinnedGroup>

              {/* Center Cells */}
              <GridPrimitives.CenterGroup>
                {cells.center.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.CenterGroup>

              {/* Right Pinned Cells */}
              <GridPrimitives.RightPinnedGroup className="bg-white shadow-right-col w-fit z-30">
                {cells.right.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.RightPinnedGroup>
            </GridPrimitives.Row>
          ))}
        </GridPrimitives.Body>

        {/* Footer */}
        <GridPrimitives.Footer className="z-30 shadow-sm border-t bg-accent">
          <GridPrimitives.FooterRow>
            <GridPrimitives.LeftPinnedGroup className="bg-accent shadow-left-col z-30">
              {virtualFooters.left.map(({ key, footer, footerRect }) => (
                <GridPrimitives.FooterCell
                  key={key}
                  colIndex={footer.column.getIndex()}
                  footerRect={footerRect}
                  className="flex items-center px-3 text-sm border-r last:border-r-0 bg-accent"
                >
                  {flexRender(footer.column.columnDef.footer, footer.getContext())}
                </GridPrimitives.FooterCell>
              ))}
            </GridPrimitives.LeftPinnedGroup>
            <GridPrimitives.CenterGroup className="z-10">
              {virtualFooters.center.map(({ key, footer, footerRect }) => (
                <GridPrimitives.FooterCell
                  key={key}
                  colIndex={footer.column.getIndex()}
                  footerRect={footerRect}
                  className="flex items-center px-3 text-sm border-r last:border-r-0 bg-accent"
                >
                  {flexRender(footer.column.columnDef.footer, footer.getContext())}
                </GridPrimitives.FooterCell>
              ))}
            </GridPrimitives.CenterGroup>
            <GridPrimitives.RightPinnedGroup className="bg-accent shadow-right-col z-30">
              {virtualFooters.right.map(({ key, footer, footerRect }) => (
                <GridPrimitives.FooterCell
                  className="flex items-center px-3 text-sm border-r last:border-r-0 bg-accent"
                  key={key}
                  colIndex={footer.column.getIndex()}
                  footerRect={footerRect}
                >
                  {flexRender(footer.column.columnDef.footer, footer.getContext())}
                </GridPrimitives.FooterCell>
              ))}
            </GridPrimitives.RightPinnedGroup>
          </GridPrimitives.FooterRow>
        </GridPrimitives.Footer>
      </GridPrimitives.Root>
    );
  },
};

// ========================= WIDE TABLE WITH PINNING STORY =========================

// 1 left pinned, 1 center, 2 right pinned columns
const wideTableColumns = assertNoGroupColumnDefs([
  columns[0], // sku - left pinned
  columns[1], // name - center
  columns[5], // status - right pinned
  columns[9], // rating - right pinned
]);

export const WideTableWithPinning: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: mockProducts.slice(0, 100),
        columns: wideTableColumns,
        state: {
          columnPinning: {
            left: ['sku'],
            right: ['status', 'rating'],
          },
        },
      },
      headerHeight: 44,
      footerHeight: 44,
      rowHeight: 48,
      overscan: {
        row: 0,
        col: 0,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <GridPrimitives.Root
        className="w-[1500px] h-[450px] border bg-white shadow-sm"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        {/* Header */}
        <GridPrimitives.Header className="z-30 shadow-sm">
          <GridPrimitives.HeaderRow>
            <GridPrimitives.LeftPinnedGroup className="bg-white shadow-left-col z-30">
              {virtualHeaders.left.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.LeftPinnedGroup>
            <GridPrimitives.CenterGroup className="z-10">
              {virtualHeaders.center.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.CenterGroup>
            <GridPrimitives.RightPinnedGroup className="bg-white shadow-right-col z-30">
              {virtualHeaders.right.map(({ key, header, headerRect }) => (
                <GridPrimitives.HeaderCell
                  className="flex items-center px-3 text-sm border-b border-r last:border-r-0 bg-accent"
                  key={key}
                  colIndex={header.column.getIndex()}
                  headerRect={headerRect}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </GridPrimitives.HeaderCell>
              ))}
            </GridPrimitives.RightPinnedGroup>
          </GridPrimitives.HeaderRow>
        </GridPrimitives.Header>

        {/* Body */}
        <GridPrimitives.Body className="relative">
          {virtualRows.map(({ key, index, rowRect, cells }) => (
            <GridPrimitives.Row
              key={key}
              rowIndex={index}
              rowRect={rowRect}
              className="border-b hover:transition-colors"
            >
              {/* Left Pinned Cells */}
              <GridPrimitives.LeftPinnedGroup className="bg-white shadow-left-col w-fit z-30">
                {cells.left.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.LeftPinnedGroup>

              {/* Center Cells */}
              <GridPrimitives.CenterGroup>
                {cells.center.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.CenterGroup>

              {/* Right Pinned Cells */}
              <GridPrimitives.RightPinnedGroup className="bg-white shadow-right-col w-fit z-30">
                {cells.right.map(({ key, cell, cellRect, index }) => (
                  <GridPrimitives.Cell
                    key={key}
                    colIndex={index}
                    cellRect={cellRect}
                    className="flex items-center px-3 text-sm border-b border-r last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </GridPrimitives.Cell>
                ))}
              </GridPrimitives.RightPinnedGroup>
            </GridPrimitives.Row>
          ))}
        </GridPrimitives.Body>
      </GridPrimitives.Root>
    );
  },
};
