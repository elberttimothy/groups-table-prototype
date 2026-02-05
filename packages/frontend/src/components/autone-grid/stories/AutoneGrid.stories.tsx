import { type Meta, type StoryObj } from '@storybook/react-vite';
import { flexRender, type VisibilityState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMockInfiniteApi } from '../../../hooks/useMockInfiniteApi';
import { useMockPaginatedApi } from '../../../hooks/useMockPaginatedApi';
import {
  isDataTableLoadingObject,
  useDataTableLoadingGuard,
} from '../../table';
import {
  AutoneGrid,
  AutoneGridDynamicPreset,
  AutoneGridPreset,
} from '../autone-primitives';
import { useDataGrid } from '../hooks/use-data-grid';
import { columns } from '../mocks/columns';
import { mockProducts } from '../mocks/mock-data';
import { variableColumns } from '../mocks/variable-content-columns';
import { variableMockProducts } from '../mocks/variable-content-mock-data';
import { assertNoGroupColumnDefs } from '../utilities/invariants';

// ========================= STORY HELPERS =========================

/**
 * Column display text mapping for the mock columns.
 * Used by the ColumnDragOverlay to show the column name when dragging.
 */
const columnDisplayText: Record<string, string> = {
  sku: 'SKU',
  name: 'Product Name',
  category: 'Category',
  price: 'Price',
  stock: 'Stock',
  status: 'Status',
  supplier: 'Supplier',
  warehouse: 'Warehouse',
  weight: 'Weight',
  rating: 'Rating',
  lastUpdated: 'Last Updated',
};

/**
 * Reusable ColumnDragOverlay component for stories.
 * Renders a drag overlay that shows the column name when dragging.
 */
const StoryColumnDragOverlay = () => (
  <AutoneGridPreset.ColumnDragOverlay columnDisplayText={columnDisplayText} />
);

// ========================= STORY META =========================

export default {
  title: 'Components/Autone Data Grid/AutoneGrid',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

type Story = StoryObj;

// ========================= STORIES =========================

/**
 * A basic minimal flat table with no column pinning.
 * Demonstrates the simplest composition of AutoneGridPreset components.
 */
export const BasicMinimalTable: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: useMemo(() => mockProducts.slice(0, 50), []),
        columns: assertNoGroupColumnDefs(columns.slice(0, 5)),
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <AutoneGridPreset.Root
        className="w-[700px] h-[450px] bg-white"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
          {({ header, headerRect }) => (
            <AutoneGrid.HeaderCell
              columnId={header.column.id}
              colIndex={header.column.getIndex()}
              headerRect={headerRect}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </AutoneGrid.HeaderCell>
          )}
        </AutoneGridPreset.Header>
        <AutoneGridPreset.Body>
          {virtualRows.map((virtualRow) => (
            <AutoneGridPreset.Row key={virtualRow.key} virtualRow={virtualRow}>
              {({ cell, cellRect, index }) => (
                <AutoneGridPreset.Cell
                  columnId={cell.column.id}
                  colIndex={index}
                  rowIndex={virtualRow.index}
                  cellRect={cellRect}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </AutoneGridPreset.Cell>
              )}
            </AutoneGridPreset.Row>
          ))}
        </AutoneGridPreset.Body>
        <StoryColumnDragOverlay />
      </AutoneGridPreset.Root>
    );
  },
};

/**
 * Demonstrates column pinning with left and right pinned columns.
 * The SKU column is pinned to the left, and the Status column is pinned to the right.
 */
export const ColumnPinning: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: mockProducts,
        columns: assertNoGroupColumnDefs(columns),
        state: {
          columnPinning: {
            left: ['sku', 'name'],
            right: ['status'],
          },
        },
      },
      headerHeight: 44,
      footerHeight: 44,
      rowHeight: 48,
      overscan: {
        row: 5,
        col: 2,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <AutoneGridPreset.Root
        className="w-[700px] h-[450px] bg-white"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
          {({ header, headerRect }) => (
            <AutoneGrid.HeaderCell
              columnId={header.column.id}
              colIndex={header.column.getIndex()}
              headerRect={headerRect}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </AutoneGrid.HeaderCell>
          )}
        </AutoneGridPreset.Header>
        <AutoneGridPreset.Body>
          {virtualRows.map((virtualRow) => (
            <AutoneGridPreset.Row key={virtualRow.key} virtualRow={virtualRow}>
              {({ cell, cellRect, index }) => (
                <AutoneGridPreset.Cell
                  columnId={cell.column.id}
                  colIndex={index}
                  cellRect={cellRect}
                  rowIndex={virtualRow.index}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </AutoneGridPreset.Cell>
              )}
            </AutoneGridPreset.Row>
          ))}
        </AutoneGridPreset.Body>
        <StoryColumnDragOverlay />
      </AutoneGridPreset.Root>
    );
  },
};

/**
 * Demonstrates column visibility with toggleable columns.
 * Use the checkboxes above the table to show/hide columns.
 */
export const ColumnVisibility: Story = {
  render: () => {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
      sku: true,
      name: true,
      category: true,
      price: true,
      stock: true,
      status: false,
      supplier: false,
      warehouse: false,
      weight: false,
      rating: false,
      lastUpdated: false,
    });

    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: useMemo(() => mockProducts.slice(0, 100), []),
        columns: assertNoGroupColumnDefs(columns),
        state: {
          columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
      },
      headerHeight: 44,
      footerHeight: 44,
      rowHeight: 48,
      overscan: {
        row: 5,
        col: 2,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    const allColumns = gridConfig.table.getAllColumns();

    return (
      <div className="flex flex-col gap-4">
        {/* Column visibility toggles */}
        <div className="flex flex-wrap gap-3 p-3 bg-secondary rounded-md">
          {allColumns.map((column) => (
            <label
              key={column.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                className="rounded border-border"
              />
              {column.id}
            </label>
          ))}
        </div>

        <AutoneGridPreset.Root
          className="w-[700px] h-[400px] bg-white"
          gridConfig={gridConfig}
          ref={scrollElementRef}
        >
          <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
            {({ header, headerRect }) => (
              <AutoneGrid.HeaderCell
                columnId={header.column.id}
                colIndex={header.column.getIndex()}
                headerRect={headerRect}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </AutoneGrid.HeaderCell>
            )}
          </AutoneGridPreset.Header>
          <AutoneGridPreset.Body>
            {virtualRows.map((virtualRow) => (
              <AutoneGridPreset.Row
                key={virtualRow.key}
                virtualRow={virtualRow}
              >
                {({ cell, cellRect, index }) => (
                  <AutoneGridPreset.Cell
                    columnId={cell.column.id}
                    colIndex={index}
                    cellRect={cellRect}
                    rowIndex={virtualRow.index}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </AutoneGridPreset.Cell>
                )}
              </AutoneGridPreset.Row>
            ))}
          </AutoneGridPreset.Body>
          <StoryColumnDragOverlay />
        </AutoneGridPreset.Root>
      </div>
    );
  },
};

/**
 * Demonstrates dynamic column widths when total column widths are less than the table width.
 * Columns with smaller defined sizes will expand to fill the available space.
 */
export const DynamicColumnWidths: Story = {
  render: () => {
    // Pick specific columns: sku (0), name (1), price (3), stock (4)
    // Total width: 100 + 220 + 100 + 80 = 500px, table is 800px wide
    const narrowColumns = useMemo(
      () => [columns[0], columns[1], columns[3], columns[4]],
      [],
    );

    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: useMemo(() => mockProducts.slice(0, 50), []),
        columns: assertNoGroupColumnDefs(narrowColumns),
      },
      headerHeight: 44,
      footerHeight: 44,
      rowHeight: 48,
      overscan: {
        row: 5,
        col: 2,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    // Calculate total column width for display
    const totalColumnWidth = narrowColumns.reduce(
      (sum, col) => sum + ((col as { size?: number }).size ?? 150),
      0,
    );

    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-muted-foreground p-3 bg-secondary rounded-md">
          Total defined column width: <strong>{totalColumnWidth}px</strong> |
          Table width: <strong>800px</strong>
          <br />
          <span className="text-xs">
            Columns will expand proportionally to fill the available space.
          </span>
        </div>

        <AutoneGridPreset.Root
          className="w-[800px] h-[400px] bg-white"
          gridConfig={gridConfig}
          ref={scrollElementRef}
        >
          <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
            {({ header, headerRect }) => (
              <AutoneGrid.HeaderCell
                columnId={header.column.id}
                colIndex={header.column.getIndex()}
                headerRect={headerRect}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </AutoneGrid.HeaderCell>
            )}
          </AutoneGridPreset.Header>
          <AutoneGridPreset.Body>
            {virtualRows.map((virtualRow) => (
              <AutoneGridPreset.Row
                key={virtualRow.key}
                virtualRow={virtualRow}
              >
                {({ cell, cellRect, index }) => (
                  <AutoneGridPreset.Cell
                    columnId={cell.column.id}
                    colIndex={index}
                    rowIndex={virtualRow.index}
                    cellRect={cellRect}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </AutoneGridPreset.Cell>
                )}
              </AutoneGridPreset.Row>
            ))}
          </AutoneGridPreset.Body>
          <StoryColumnDragOverlay />
        </AutoneGridPreset.Root>
      </div>
    );
  },
};

/**
 * Demonstrates variable row heights with a left-pinned column.
 * Rows automatically adjust their height based on content.
 */
export const VariableRowHeights: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'dynamic',
      tableOptions: {
        data: useMemo(() => variableMockProducts, []),
        columns: assertNoGroupColumnDefs(variableColumns),
        state: {
          columnPinning: {
            left: ['sku'],
          },
        },
      },
      headerHeight: 44,
      footerHeight: 44,
      estimateRowHeight: () => 48,
      overscan: {
        row: 3,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <AutoneGridDynamicPreset.Root
        className="w-[800px] h-[500px] bg-white"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        <AutoneGridDynamicPreset.Header virtualHeaders={virtualHeaders}>
          {({ header, headerRect }) => (
            <AutoneGrid.HeaderCell
              columnId={header.column.id}
              colIndex={header.column.getIndex()}
              headerRect={headerRect}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </AutoneGrid.HeaderCell>
          )}
        </AutoneGridDynamicPreset.Header>
        <AutoneGridDynamicPreset.Body>
          {virtualRows.map((virtualRow) => (
            <AutoneGridDynamicPreset.Row
              key={virtualRow.key}
              virtualRow={virtualRow}
            >
              {({ cell, cellRect, index }) => (
                <AutoneGridDynamicPreset.Cell
                  columnId={cell.column.id}
                  rowIndex={virtualRow.index}
                  colIndex={index}
                  cellRect={cellRect}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </AutoneGridDynamicPreset.Cell>
              )}
            </AutoneGridDynamicPreset.Row>
          ))}
        </AutoneGridDynamicPreset.Body>
        <StoryColumnDragOverlay />
      </AutoneGridDynamicPreset.Root>
    );
  },
};

/**
 * Demonstrates a table with footer row showing aggregated data.
 * The footer displays totals and averages for numeric columns.
 */
export const WithFooters: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: useMemo(() => mockProducts.slice(0, 100), []),
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
        row: 5,
        col: 2,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualFooters = gridState.getVirtualFooters();
    const virtualRows = gridState.getVirtualRows();

    return (
      <AutoneGridPreset.Root
        className="w-[700px] h-[450px] bg-white"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
          {({ header, headerRect }) => (
            <AutoneGrid.HeaderCell
              columnId={header.column.id}
              colIndex={header.column.getIndex()}
              headerRect={headerRect}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </AutoneGrid.HeaderCell>
          )}
        </AutoneGridPreset.Header>
        <AutoneGridPreset.Body>
          {virtualRows.map((virtualRow) => (
            <AutoneGridPreset.Row key={virtualRow.key} virtualRow={virtualRow}>
              {({ cell, cellRect, index }) => (
                <AutoneGridPreset.Cell
                  columnId={cell.column.id}
                  colIndex={index}
                  cellRect={cellRect}
                  rowIndex={virtualRow.index}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </AutoneGridPreset.Cell>
              )}
            </AutoneGridPreset.Row>
          ))}
        </AutoneGridPreset.Body>
        <AutoneGrid.Footer>
          <AutoneGrid.FooterRow>
            <AutoneGrid.LeftFooterGroup>
              {virtualFooters.left.map(({ key, footer, footerRect }) => (
                <AutoneGrid.FooterCell
                  key={key}
                  columnId={footer.column.id}
                  colIndex={footer.column.getIndex()}
                  footerRect={footerRect}
                >
                  {flexRender(
                    footer.column.columnDef.footer,
                    footer.getContext(),
                  )}
                </AutoneGrid.FooterCell>
              ))}
            </AutoneGrid.LeftFooterGroup>
            <AutoneGrid.CenterFooterGroup>
              {virtualFooters.center.map(({ key, footer, footerRect }) => (
                <AutoneGrid.FooterCell
                  key={key}
                  columnId={footer.column.id}
                  colIndex={footer.column.getIndex()}
                  footerRect={footerRect}
                >
                  {flexRender(
                    footer.column.columnDef.footer,
                    footer.getContext(),
                  )}
                </AutoneGrid.FooterCell>
              ))}
            </AutoneGrid.CenterFooterGroup>
            <AutoneGrid.RightFooterGroup>
              {virtualFooters.right.map(({ key, footer, footerRect }) => (
                <AutoneGrid.FooterCell
                  key={key}
                  columnId={footer.column.id}
                  colIndex={footer.column.getIndex()}
                  footerRect={footerRect}
                >
                  {flexRender(
                    footer.column.columnDef.footer,
                    footer.getContext(),
                  )}
                </AutoneGrid.FooterCell>
              ))}
            </AutoneGrid.RightFooterGroup>
          </AutoneGrid.FooterRow>
        </AutoneGrid.Footer>
        <StoryColumnDragOverlay />
      </AutoneGridPreset.Root>
    );
  },
};

export const WithHighlightedRowOnMount: Story = {
  render: () => {
    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: useMemo(() => mockProducts.slice(0, 100), []),
        columns: assertNoGroupColumnDefs(columns),
        state: {
          columnPinning: {
            left: ['sku'],
          },
        },
        getRowId: (row, idx) =>
          isDataTableLoadingObject(row) ? idx.toString() : row.id,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    useEffect(() => {
      setTimeout(() => {
        gridConfig.rowVirtualiser.scrollToIndex(20, {
          align: 'center',
          behavior: 'smooth',
        });
      });
    }, [gridConfig.rowVirtualiser]);

    return (
      <AutoneGridPreset.Root
        className="w-[700px] h-[450px] bg-white"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
          {({ header, headerRect }) => (
            <AutoneGrid.HeaderCell
              columnId={header.column.id}
              colIndex={header.column.getIndex()}
              headerRect={headerRect}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </AutoneGrid.HeaderCell>
          )}
        </AutoneGridPreset.Header>
        <AutoneGridPreset.Body>
          {virtualRows.map((virtualRow) => (
            <AutoneGridPreset.Row
              key={virtualRow.key}
              virtualRow={virtualRow}
              highlightOnMount={virtualRow.row.id === mockProducts[20].id}
            >
              {({ cell, cellRect, index }) => (
                <AutoneGridPreset.Cell
                  columnId={cell.column.id}
                  colIndex={index}
                  cellRect={cellRect}
                  rowIndex={virtualRow.index}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </AutoneGridPreset.Cell>
              )}
            </AutoneGridPreset.Row>
          ))}
        </AutoneGridPreset.Body>
        <StoryColumnDragOverlay />
      </AutoneGridPreset.Root>
    );
  },
};

// ========================= INFINITE SCROLL =========================

const infiniteScrollData = mockProducts.slice(0, 100);
const infiniteScrollVariableData = variableMockProducts.slice(0, 100);

export const InfiniteScroll: Story = {
  render: () => {
    const { pages, loadNextPage, canLoadNextPage, isFetching, isLoading } =
      useMockInfiniteApi(infiniteScrollData, 25, 2000);

    const allData = useMemo(() => pages.flat(), [pages]);

    const { memoisedData, getRowIdLoadingGuard } = useDataTableLoadingGuard({
      mode: 'fixed',
      isLoading,
      data: allData,
      rowCount: 25,
    });

    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: memoisedData,
        columns: assertNoGroupColumnDefs(columns),
        state: {
          columnPinning: {
            left: ['sku'],
          },
        },
        getRowId: getRowIdLoadingGuard((row) => row.id),
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    const onSentinelEnter = useCallback(() => {
      loadNextPage();
    }, [loadNextPage]);

    return (
      <AutoneGridPreset.Root
        className="w-[700px] h-[450px] bg-white"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
          {({ header, headerRect }) => (
            <AutoneGrid.HeaderCell
              columnId={header.column.id}
              colIndex={header.column.getIndex()}
              headerRect={headerRect}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </AutoneGrid.HeaderCell>
          )}
        </AutoneGridPreset.Header>
        <AutoneGridPreset.Body>
          {virtualRows.map((virtualRow) => (
            <AutoneGridPreset.Row key={virtualRow.key} virtualRow={virtualRow}>
              {({ cell, cellRect, index }) => (
                <AutoneGridPreset.Cell
                  columnId={cell.column.id}
                  colIndex={index}
                  cellRect={cellRect}
                  rowIndex={virtualRow.index}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </AutoneGridPreset.Cell>
              )}
            </AutoneGridPreset.Row>
          ))}
        </AutoneGridPreset.Body>
        <AutoneGrid.InfiniteScrollSentinel
          canGetNextPage={canLoadNextPage}
          onSentinelEnter={onSentinelEnter}
          isFetching={isFetching}
          isLoading={isLoading}
        />
        <StoryColumnDragOverlay />
      </AutoneGridPreset.Root>
    );
  },
};

export const InfiniteScrollDynamicRowHeights: Story = {
  render: () => {
    const { pages, loadNextPage, canLoadNextPage, isFetching, isLoading } =
      useMockInfiniteApi(infiniteScrollVariableData, 25, 1500);

    const allData = useMemo(() => pages.flat(), [pages]);

    const { memoisedData, getRowIdLoadingGuard } = useDataTableLoadingGuard({
      mode: 'dynamic',
      isLoading,
      data: allData,
      initialRowCount: 25,
    });

    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'dynamic',
      tableOptions: {
        data: memoisedData,
        columns: assertNoGroupColumnDefs(variableColumns),
        state: {
          columnPinning: {
            left: ['sku'],
          },
        },
        getRowId: getRowIdLoadingGuard((row) => row.id),
      },
      headerHeight: 44,
      footerHeight: 44,
      estimateRowHeight: () => 120,
      overscan: {
        row: 3,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    const onSentinelEnter = useCallback(() => {
      loadNextPage();
    }, [loadNextPage]);

    return (
      <AutoneGridDynamicPreset.Root
        className="w-[800px] h-[500px] bg-white"
        gridConfig={gridConfig}
        ref={scrollElementRef}
      >
        <AutoneGridDynamicPreset.Header virtualHeaders={virtualHeaders}>
          {({ header, headerRect }) => (
            <AutoneGrid.HeaderCell
              columnId={header.column.id}
              colIndex={header.column.getIndex()}
              headerRect={headerRect}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </AutoneGrid.HeaderCell>
          )}
        </AutoneGridDynamicPreset.Header>
        <AutoneGridDynamicPreset.Body>
          {isLoading
            ? // on mount, we abide to the heights set by the estimateRowHeight function
              virtualRows.map((virtualRow) => (
                <AutoneGridPreset.Row
                  key={virtualRow.key}
                  virtualRow={virtualRow}
                >
                  {({ cell, cellRect, index }) => (
                    <AutoneGridPreset.Cell
                      columnId={cell.column.id}
                      colIndex={index}
                      cellRect={cellRect}
                      rowIndex={virtualRow.index}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </AutoneGridPreset.Cell>
                  )}
                </AutoneGridPreset.Row>
              ))
            : // after the initial load, we use the dynamic row to measure the row heights
              virtualRows.map((virtualRow) => (
                <AutoneGridDynamicPreset.Row
                  key={virtualRow.key}
                  virtualRow={virtualRow}
                >
                  {({ cell, cellRect, index }) => (
                    <AutoneGridDynamicPreset.Cell
                      columnId={cell.column.id}
                      rowIndex={virtualRow.index}
                      colIndex={index}
                      cellRect={cellRect}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </AutoneGridDynamicPreset.Cell>
                  )}
                </AutoneGridDynamicPreset.Row>
              ))}
        </AutoneGridDynamicPreset.Body>
        <AutoneGridDynamicPreset.InfiniteScrollSentinel
          canGetNextPage={canLoadNextPage}
          onSentinelEnter={onSentinelEnter}
          isFetching={isFetching}
          isLoading={isLoading}
        />
        <StoryColumnDragOverlay />
      </AutoneGridDynamicPreset.Root>
    );
  },
};

// ========================= PAGINATION =========================

const paginatedData = mockProducts.slice(0, 105);

/**
 * Demonstrates server-side pagination with the AutoneGrid.
 * Uses AutoneGridPreset.Container to wrap the grid and pagination controls.
 */
export const WithPagination: Story = {
  render: () => {
    const { isLoading, currentPage, totalCount, pagination } =
      useMockPaginatedApi(paginatedData, 25, 1000);

    const { memoisedData, getRowIdLoadingGuard } = useDataTableLoadingGuard({
      mode: 'fixed',
      isLoading,
      data: currentPage,
      rowCount: 25,
    });

    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: memoisedData,
        columns: assertNoGroupColumnDefs(columns),
        state: {
          columnPinning: {
            left: ['sku'],
            right: ['status'],
          },
        },
        getRowId: getRowIdLoadingGuard((row) => row.id),
      },
      headerHeight: 44,
      footerHeight: 44,
      rowHeight: 48,
      overscan: {
        row: 5,
        col: 2,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <AutoneGridPreset.Container className="w-[800px]">
        <AutoneGridPreset.Root
          className="w-full h-[450px] bg-white"
          gridConfig={gridConfig}
          ref={scrollElementRef}
        >
          <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
            {({ header, headerRect }) => (
              <AutoneGrid.HeaderCell
                columnId={header.column.id}
                colIndex={header.column.getIndex()}
                headerRect={headerRect}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </AutoneGrid.HeaderCell>
            )}
          </AutoneGridPreset.Header>
          <AutoneGridPreset.Body>
            {virtualRows.map((virtualRow) => (
              <AutoneGridPreset.Row
                key={virtualRow.key}
                virtualRow={virtualRow}
              >
                {({ cell, cellRect, index }) => (
                  <AutoneGridPreset.Cell
                    columnId={cell.column.id}
                    colIndex={index}
                    cellRect={cellRect}
                    rowIndex={virtualRow.index}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </AutoneGridPreset.Cell>
                )}
              </AutoneGridPreset.Row>
            ))}
          </AutoneGridPreset.Body>
          <StoryColumnDragOverlay />
        </AutoneGridPreset.Root>
        <AutoneGridPreset.Pagination
          {...pagination}
          totalRows={totalCount}
          loading={isLoading}
        />
      </AutoneGridPreset.Container>
    );
  },
};

// ========================= COLUMN REORDERING =========================

/**
 * Demonstrates column reordering with controlled state.
 * Drag column headers in the center (unpinned) area to reorder them.
 * Pinned columns (left/right) cannot be reordered.
 */
export const ColumnReordering: Story = {
  render: () => {
    const [isReorderingEnabled, setIsReorderingEnabled] = useState(true);
    const [columnOrder, setColumnOrder] = useState([
      'sku',
      'name',
      'category',
      'price',
      'stock',
      'status',
      'supplier',
      'warehouse',
      'weight',
      'rating',
      'lastUpdated',
    ]);

    const [scrollElementRef, gridState, gridConfig] = useDataGrid({
      mode: 'fixed',
      tableOptions: {
        data: useMemo(() => mockProducts.slice(0, 1000), []),
        columns: assertNoGroupColumnDefs(columns),
        state: {
          columnOrder,
          columnPinning: {
            left: ['sku'],
            right: ['status'],
          },
        },
        onColumnOrderChange: setColumnOrder,
      },
      // tune overscan to minimise render work when reordering columns
      overscan: {
        row: 10,
        // add a small overscan so edge columns can be pre-rendered if users drag and scroll in the x-axis
        col: 1,
      },
    });

    const virtualHeaders = gridState.getVirtualHeaders();
    const virtualRows = gridState.getVirtualRows();

    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-muted-foreground p-3 bg-secondary rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isReorderingEnabled}
                onChange={(e) => setIsReorderingEnabled(e.target.checked)}
                className="rounded border-border"
              />
              Enable Column Reordering
            </label>
          </div>
          <strong>Column Order:</strong> {columnOrder.join(' → ')}
          <br />
          <span className="text-xs">
            {isReorderingEnabled
              ? 'Drag column headers in the center area to reorder. Pinned columns (SKU on left, Status on right) cannot be reordered.'
              : 'Column reordering is disabled.'}
          </span>
        </div>

        <AutoneGridPreset.Root
          className="w-[800px] h-[450px] bg-white"
          gridConfig={gridConfig}
          ref={scrollElementRef}
          disableColumnDnd={!isReorderingEnabled}
        >
          <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
            {({ header, headerRect }) => (
              <AutoneGrid.HeaderCell
                columnId={header.column.id}
                colIndex={header.column.getIndex()}
                headerRect={headerRect}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </AutoneGrid.HeaderCell>
            )}
          </AutoneGridPreset.Header>
          <AutoneGridPreset.Body>
            {virtualRows.map((virtualRow) => (
              <AutoneGridPreset.Row
                key={virtualRow.key}
                virtualRow={virtualRow}
              >
                {({ cell, cellRect, index }) => (
                  <AutoneGridPreset.Cell
                    columnId={cell.column.id}
                    colIndex={index}
                    cellRect={cellRect}
                    rowIndex={virtualRow.index}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </AutoneGridPreset.Cell>
                )}
              </AutoneGridPreset.Row>
            ))}
          </AutoneGridPreset.Body>
          {isReorderingEnabled && <StoryColumnDragOverlay />}
        </AutoneGridPreset.Root>
      </div>
    );
  },
};

// ========================= EDGE CASES =========================

const mockProducts2Rows = mockProducts.slice(0, 2);

export const TotalRowHeightLessThanTableTest = () => {
  const [scrollElementRef, gridState, gridConfig] = useDataGrid({
    mode: 'fixed',
    tableOptions: {
      data: mockProducts2Rows,
      columns: assertNoGroupColumnDefs(columns),
      state: {
        columnPinning: {
          left: ['sku', 'name'],
          right: ['status'],
        },
      },
    },
    headerHeight: 44,
    footerHeight: 44,
    rowHeight: 48,
    overscan: {
      row: 5,
      col: 2,
    },
  });

  const virtualHeaders = gridState.getVirtualHeaders();
  const virtualRows = gridState.getVirtualRows();

  return (
    <AutoneGridPreset.Root
      data-testid="autone-grid"
      className="w-[700px] h-[450px] bg-white"
      gridConfig={gridConfig}
      ref={scrollElementRef}
    >
      <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
        {({ header, headerRect }) => (
          <AutoneGrid.HeaderCell
            columnId={header.column.id}
            colIndex={header.column.getIndex()}
            headerRect={headerRect}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </AutoneGrid.HeaderCell>
        )}
      </AutoneGridPreset.Header>
      <AutoneGridPreset.Body>
        {virtualRows.map((virtualRow) => (
          <AutoneGridPreset.Row key={virtualRow.key} virtualRow={virtualRow}>
            {({ cell, cellRect, index }) => (
              <AutoneGridPreset.Cell
                columnId={cell.column.id}
                colIndex={index}
                cellRect={cellRect}
                rowIndex={virtualRow.index}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </AutoneGridPreset.Cell>
            )}
          </AutoneGridPreset.Row>
        ))}
      </AutoneGridPreset.Body>
      <StoryColumnDragOverlay />
    </AutoneGridPreset.Root>
  );
};
