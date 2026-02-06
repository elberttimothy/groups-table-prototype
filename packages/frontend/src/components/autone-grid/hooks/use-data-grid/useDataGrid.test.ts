import { createColumnHelper } from '@tanstack/react-table';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { assertNoGroupColumnDefs } from '../../utilities/invariants';

import { useDataGrid } from './useDataGrid';
import { type TableOptionsWithoutInitialState } from './useDataGrid.types';

// ============================================================================
// TEST DATA TYPES & FIXTURES
// ============================================================================

type TestRow = {
  id: string;
  name: string;
  value: number;
  category: string;
  status: string;
};

const columnHelper = createColumnHelper<TestRow>();

// Simple 5-column flat structure
const flatColumns = assertNoGroupColumnDefs([
  columnHelper.accessor('id', { id: 'id', size: 100 }),
  columnHelper.accessor('name', { id: 'name', size: 150 }),
  columnHelper.accessor('value', { id: 'value', size: 120 }),
  columnHelper.accessor('category', { id: 'category', size: 130 }),
  columnHelper.accessor('status', { id: 'status', size: 110 }),
]);

// Generate test data
const generateTestData = (count: number): TestRow[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    name: `Name ${i}`,
    value: i * 100,
    category: `Category ${i % 3}`,
    status: i % 2 === 0 ? 'active' : 'inactive',
  }));

const testData = generateTestData(20);

const DEFAULT_HEADER_HEIGHT = 40;
const DEFAULT_FOOTER_HEIGHT = 40;
const DEFAULT_ROW_HEIGHT = 50;

const createTableOptions = (
  overrides: Partial<TableOptionsWithoutInitialState<TestRow>> = {}
): TableOptionsWithoutInitialState<TestRow> => ({
  data: testData,
  columns: flatColumns,
  ...overrides,
});

// ============================================================================
// TESTS
// Note: TanStack Virtual requires real DOM measurements to calculate visible items,
// so tests focus on the business logic that can be verified in JSDOM:
// - Hook return shape and configuration
// - Table setup and pinning configuration
// - Header/footer getters for pinned columns
// - Column visibility effects on table state
// ============================================================================

describe('useDataGrid', () => {
  // ==========================================================================
  // BASIC INITIALIZATION TESTS - FIXED MODE
  // ==========================================================================

  describe('basic initialization (fixed mode)', () => {
    it('returns the expected shape of data', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [setScrollElement, gridState, gridConfig] = result.current;

      // Verify setScrollElement is a function
      expect(typeof setScrollElement).toBe('function');

      // Verify gridState methods
      expect(gridState).toHaveProperty('getVirtualHeaders');
      expect(gridState).toHaveProperty('getVirtualFooters');
      expect(gridState).toHaveProperty('getVirtualCells');

      // Verify gridConfig
      expect(gridConfig).toHaveProperty('table');
      expect(gridConfig).toHaveProperty('columnVirtualiser');
      expect(gridConfig).toHaveProperty('rowVirtualiser');
      expect(gridConfig).toHaveProperty('scrollElement');
      expect(gridConfig).toHaveProperty('rowWidth');
      expect(gridConfig).toHaveProperty('headerHeight');
      expect(gridConfig).toHaveProperty('footerHeight');
      expect(gridConfig.headerHeight).toBe(DEFAULT_HEADER_HEIGHT);
      expect(gridConfig.footerHeight).toBe(DEFAULT_FOOTER_HEIGHT);
    });

    it('configures table instance correctly', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;
      const { table } = gridConfig;

      expect(table.getRowModel().rows).toHaveLength(20);
      expect(table.getAllLeafColumns()).toHaveLength(5);
    });
  });

  // ==========================================================================
  // BASIC INITIALIZATION TESTS - DYNAMIC MODE
  // ==========================================================================

  describe('basic initialization (dynamic mode)', () => {
    it('returns the expected shape of data', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'dynamic',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          estimateRowHeight: () => DEFAULT_ROW_HEIGHT,
          overscan: { row: 0 },
        })
      );

      const [setScrollElement, gridState, gridConfig] = result.current;

      // Verify setScrollElement is a function
      expect(typeof setScrollElement).toBe('function');

      // Verify gridState methods
      expect(gridState).toHaveProperty('getVirtualHeaders');
      expect(gridState).toHaveProperty('getVirtualFooters');
      expect(gridState).toHaveProperty('getVirtualCells');

      // Verify gridConfig
      expect(gridConfig).toHaveProperty('table');
      expect(gridConfig).toHaveProperty('columnVirtualiser');
      expect(gridConfig).toHaveProperty('rowVirtualiser');
      expect(gridConfig.headerHeight).toBe(DEFAULT_HEADER_HEIGHT);
      expect(gridConfig.footerHeight).toBe(DEFAULT_FOOTER_HEIGHT);
    });

    it('configures table instance correctly in dynamic mode', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'dynamic',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          estimateRowHeight: () => DEFAULT_ROW_HEIGHT,
        })
      );

      const [, , gridConfig] = result.current;
      const { table } = gridConfig;

      expect(table.getRowModel().rows).toHaveLength(20);
      expect(table.getAllLeafColumns()).toHaveLength(5);
    });
  });

  // ==========================================================================
  // NO PINNING TESTS
  // ==========================================================================

  describe('no columns pinned', () => {
    it('returns empty arrays for left and right pinned headers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const headers = gridState.getVirtualHeaders();

      expect(headers.left).toHaveLength(0);
      expect(headers.right).toHaveLength(0);
    });

    it('returns empty arrays for left and right pinned footers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const footers = gridState.getVirtualFooters();

      expect(footers.left).toHaveLength(0);
      expect(footers.right).toHaveLength(0);
    });

    it('has all columns in center visible leaf columns', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;

      expect(gridConfig.table.getCenterVisibleLeafColumns()).toHaveLength(5);
      expect(gridConfig.table.getLeftVisibleLeafColumns()).toHaveLength(0);
      expect(gridConfig.table.getRightVisibleLeafColumns()).toHaveLength(0);
    });
  });

  // ==========================================================================
  // LEFT PINNING TESTS
  // ==========================================================================

  describe('left columns pinned only', () => {
    it('returns correct left pinned headers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id', 'name'], right: [] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const headers = gridState.getVirtualHeaders();

      expect(headers.left).toHaveLength(2);
      expect(headers.left.map((h) => h.header.column.id)).toEqual(['id', 'name']);
    });

    it('returns empty right pinned headers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id', 'name'], right: [] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const headers = gridState.getVirtualHeaders();
      expect(headers.right).toHaveLength(0);
    });

    it('returns correct left pinned footers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id', 'name'], right: [] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const footers = gridState.getVirtualFooters();

      expect(footers.left).toHaveLength(2);
      expect(footers.left.map((f) => f.footer.column.id)).toEqual(['id', 'name']);
    });

    it('correctly identifies column pinning state', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id', 'name'], right: [] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;
      const { table } = gridConfig;

      expect(table.getColumn('id')?.getIsPinned()).toBe('left');
      expect(table.getColumn('name')?.getIsPinned()).toBe('left');
      expect(table.getColumn('value')?.getIsPinned()).toBe(false);
      expect(table.getColumn('category')?.getIsPinned()).toBe(false);
      expect(table.getColumn('status')?.getIsPinned()).toBe(false);
    });

    it('calculates correct column distribution', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id', 'name'], right: [] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;

      expect(gridConfig.table.getLeftVisibleLeafColumns()).toHaveLength(2);
      expect(gridConfig.table.getCenterVisibleLeafColumns()).toHaveLength(3);
      expect(gridConfig.table.getRightVisibleLeafColumns()).toHaveLength(0);
    });
  });

  // ==========================================================================
  // RIGHT PINNING TESTS
  // ==========================================================================

  describe('right columns pinned only', () => {
    it('returns correct right pinned headers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: [], right: ['category', 'status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const headers = gridState.getVirtualHeaders();

      expect(headers.right).toHaveLength(2);
      expect(headers.right.map((h) => h.header.column.id)).toEqual(['category', 'status']);
    });

    it('returns empty left pinned headers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: [], right: ['category', 'status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const headers = gridState.getVirtualHeaders();
      expect(headers.left).toHaveLength(0);
    });

    it('returns correct right pinned footers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: [], right: ['category', 'status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const footers = gridState.getVirtualFooters();

      expect(footers.right).toHaveLength(2);
      expect(footers.right.map((f) => f.footer.column.id)).toEqual(['category', 'status']);
    });

    it('correctly identifies column pinning state', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: [], right: ['category', 'status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;
      const { table } = gridConfig;

      expect(table.getColumn('id')?.getIsPinned()).toBe(false);
      expect(table.getColumn('name')?.getIsPinned()).toBe(false);
      expect(table.getColumn('value')?.getIsPinned()).toBe(false);
      expect(table.getColumn('category')?.getIsPinned()).toBe('right');
      expect(table.getColumn('status')?.getIsPinned()).toBe('right');
    });
  });

  // ==========================================================================
  // BOTH LEFT AND RIGHT PINNING TESTS
  // ==========================================================================

  describe('both left and right columns pinned', () => {
    it('returns correct pinned headers on both sides', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const headers = gridState.getVirtualHeaders();

      expect(headers.left).toHaveLength(1);
      expect(headers.left[0].header.column.id).toBe('id');

      expect(headers.right).toHaveLength(1);
      expect(headers.right[0].header.column.id).toBe('status');
    });

    it('returns correct pinned footers on both sides', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const footers = gridState.getVirtualFooters();

      expect(footers.left).toHaveLength(1);
      expect(footers.left[0].footer.column.id).toBe('id');

      expect(footers.right).toHaveLength(1);
      expect(footers.right[0].footer.column.id).toBe('status');
    });

    it('calculates correct column distribution', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id', 'name'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;

      expect(gridConfig.table.getLeftVisibleLeafColumns()).toHaveLength(2);
      expect(gridConfig.table.getCenterVisibleLeafColumns()).toHaveLength(2);
      expect(gridConfig.table.getRightVisibleLeafColumns()).toHaveLength(1);
    });
  });

  // ==========================================================================
  // ALL COLUMNS PINNED TESTS
  // ==========================================================================

  describe('all columns pinned left', () => {
    it('returns all columns as left headers and empty center', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: {
                left: ['id', 'name', 'value', 'category', 'status'],
                right: [],
              },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState, gridConfig] = result.current;
      const headers = gridState.getVirtualHeaders();

      expect(headers.left).toHaveLength(5);
      expect(headers.left.map((h) => h.header.column.id)).toEqual([
        'id',
        'name',
        'value',
        'category',
        'status',
      ]);

      expect(headers.right).toHaveLength(0);
      expect(gridConfig.table.getCenterVisibleLeafColumns()).toHaveLength(0);
    });

    it('returns all footers as left footers', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: {
                left: ['id', 'name', 'value', 'category', 'status'],
                right: [],
              },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const footers = gridState.getVirtualFooters();

      expect(footers.left).toHaveLength(5);
      expect(footers.right).toHaveLength(0);
    });
  });

  describe('all columns pinned right', () => {
    it('returns all columns as right headers and empty center', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: {
                left: [],
                right: ['id', 'name', 'value', 'category', 'status'],
              },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState, gridConfig] = result.current;
      const headers = gridState.getVirtualHeaders();

      expect(headers.right).toHaveLength(5);
      expect(headers.right.map((h) => h.header.column.id)).toEqual([
        'id',
        'name',
        'value',
        'category',
        'status',
      ]);

      expect(headers.left).toHaveLength(0);
      expect(gridConfig.table.getCenterVisibleLeafColumns()).toHaveLength(0);
    });
  });

  describe('columns split between left and right (all pinned)', () => {
    it('returns correct split of columns between left and right', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: {
                left: ['id', 'name', 'value'],
                right: ['category', 'status'],
              },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState, gridConfig] = result.current;
      const headers = gridState.getVirtualHeaders();

      expect(headers.left).toHaveLength(3);
      expect(headers.right).toHaveLength(2);
      expect(gridConfig.table.getCenterVisibleLeafColumns()).toHaveLength(0);
    });
  });

  // ==========================================================================
  // COLUMN VISIBILITY TESTS
  // ==========================================================================

  describe('column visibility changes', () => {
    it('updates table visible columns when visibility changes', () => {
      const { result, rerender } = renderHook(
        (visibility: Record<string, boolean>) =>
          useDataGrid({
            mode: 'fixed',
            tableOptions: createTableOptions({
              state: { columnVisibility: visibility },
            }),
            headerHeight: DEFAULT_HEADER_HEIGHT,
            footerHeight: DEFAULT_FOOTER_HEIGHT,
            rowHeight: DEFAULT_ROW_HEIGHT,
            overscan: { row: 0, col: 0 },
          }),
        {
          initialProps: {
            id: true,
            name: true,
            value: true,
            category: true,
            status: true,
          },
        }
      );

      // Initially all 5 columns visible
      expect(result.current[2].table.getCenterVisibleLeafColumns()).toHaveLength(5);

      // Hide 2 columns
      rerender({
        id: true,
        name: true,
        value: false,
        category: true,
        status: false,
      });

      // Now only 3 columns should be visible
      expect(result.current[2].table.getCenterVisibleLeafColumns()).toHaveLength(3);
    });

    it('hidden columns are excluded from leaf columns', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnVisibility: {
                id: true,
                name: true,
                value: false,
                category: true,
                status: false,
              },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;

      const visibleColumns = gridConfig.table.getCenterVisibleLeafColumns();
      expect(visibleColumns).toHaveLength(3);
      expect(visibleColumns.map((c) => c.id)).toEqual(['id', 'name', 'category']);
    });
  });

  // ==========================================================================
  // ROW AND COLUMN COUNT TESTS
  // ==========================================================================

  describe('row and column counts', () => {
    it('table has correct row count', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;

      // Should match the data length
      expect(gridConfig.table.getRowModel().rows).toHaveLength(20);
    });

    it('table has correct column count for center', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, , gridConfig] = result.current;

      // Center should have 3 columns (name, value, category)
      expect(gridConfig.table.getCenterVisibleLeafColumns()).toHaveLength(3);
    });
  });

  // ==========================================================================
  // OVERSCAN CONFIGURATION TESTS
  // ==========================================================================

  describe('overscan configuration', () => {
    it('accepts custom overscan values in fixed mode', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 10, col: 5 },
        })
      );

      // Just verify the hook doesn't crash with custom overscan
      expect(result.current).toBeDefined();
    });

    it('accepts custom overscan values in dynamic mode', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'dynamic',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          estimateRowHeight: () => DEFAULT_ROW_HEIGHT,
          overscan: { row: 10 },
        })
      );

      // Just verify the hook doesn't crash with custom overscan
      expect(result.current).toBeDefined();
    });

    it('uses default overscan when not provided in fixed mode', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
        })
      );

      // Just verify the hook doesn't crash with default overscan
      expect(result.current).toBeDefined();
    });

    it('uses default overscan when not provided in dynamic mode', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'dynamic',
          tableOptions: createTableOptions(),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          estimateRowHeight: () => DEFAULT_ROW_HEIGHT,
        })
      );

      // Just verify the hook doesn't crash with default overscan
      expect(result.current).toBeDefined();
    });
  });

  // ==========================================================================
  // HEADER/FOOTER RECT TESTS
  // ==========================================================================

  describe('header rects', () => {
    it('pinned headers have correct height', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const headers = gridState.getVirtualHeaders();

      expect(headers.left[0].headerRect.height).toBe(DEFAULT_HEADER_HEIGHT);
      expect(headers.right[0].headerRect.height).toBe(DEFAULT_HEADER_HEIGHT);
    });

    it('pinned headers have correct width based on column size', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const headers = gridState.getVirtualHeaders();

      // id column has size 100, status column has size 110
      expect(headers.left[0].headerRect.width).toBe(100);
      expect(headers.right[0].headerRect.width).toBe(110);
    });
  });

  describe('footer rects', () => {
    it('pinned footers have correct height', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const footers = gridState.getVirtualFooters();

      expect(footers.left[0].footerRect.height).toBe(DEFAULT_FOOTER_HEIGHT);
      expect(footers.right[0].footerRect.height).toBe(DEFAULT_FOOTER_HEIGHT);
    });

    it('pinned footers have correct width based on column size', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const footers = gridState.getVirtualFooters();

      // id column has size 100, status column has size 110
      expect(footers.left[0].footerRect.width).toBe(100);
      expect(footers.right[0].footerRect.width).toBe(110);
    });

    it('pinned footers have relative position', () => {
      const { result } = renderHook(() =>
        useDataGrid({
          mode: 'fixed',
          tableOptions: createTableOptions({
            state: {
              columnPinning: { left: ['id'], right: ['status'] },
            },
          }),
          headerHeight: DEFAULT_HEADER_HEIGHT,
          footerHeight: DEFAULT_FOOTER_HEIGHT,
          rowHeight: DEFAULT_ROW_HEIGHT,
          overscan: { row: 0, col: 0 },
        })
      );

      const [, gridState] = result.current;
      const footers = gridState.getVirtualFooters();

      expect(footers.left[0].footerRect.position).toBe('relative');
      expect(footers.right[0].footerRect.position).toBe('relative');
    });
  });
});
