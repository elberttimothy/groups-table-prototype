import { type CellContext, type HeaderContext } from '@tanstack/react-table';
import { type DeepPartial } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import {
  createColumnLoadingGuards,
  createDataTableLoadingObject,
  type DataTableLoadingObject,
} from './create-column-loading-guards';

type TData = {
  value: string;
};

describe('`createColumnLoadingGuards` Testing Suite', () => {
  const mockData: TData[] = [{ value: 'value1' }, { value: 'value2' }];

  const mockLoadingData: DataTableLoadingObject[] = [
    createDataTableLoadingObject({}),
    createDataTableLoadingObject({}),
  ];

  type MockCellContext = CellContext<TData | DataTableLoadingObject, unknown>;
  type MockHeaderContext = HeaderContext<
    TData | DataTableLoadingObject,
    string | DataTableLoadingObject
  >;

  const mockCellContext: DeepPartial<MockCellContext> = {
    row: {
      original: mockData[0],
    },
  };

  const mockHeaderContext: DeepPartial<MockHeaderContext> = {
    table: {
      getCoreRowModel: () => ({
        rows: mockData.map((data) => ({ original: data })),
      }),
    },
  };

  const mockLoadingCellContext: DeepPartial<MockCellContext> = {
    row: {
      original: mockLoadingData[0],
    },
  };

  const mockLoadingHeaderContext: DeepPartial<MockHeaderContext> = {
    table: {
      getCoreRowModel: () => ({
        rows: mockLoadingData.map((data) => ({ original: data })),
      }),
    },
  };

  const mockSomeLoadingHeaderContext: DeepPartial<MockHeaderContext> = {
    table: {
      getCoreRowModel: () => ({
        rows: [
          ...mockLoadingData.map((data) => ({ original: data })),
          ...mockData.map((data) => ({ original: data })),
        ],
      }),
    },
  };

  const { accessorFnGuard, columnCellGuard, columnHeaderGuard } =
    createColumnLoadingGuards<TData>();

  it('should not call the accessorFn if the row is loading', () => {
    const accessorFn = accessorFnGuard((row) => row.value);

    expect(accessorFn(mockData[0], 0)).toBe('value1');
    expect(accessorFn(mockLoadingData[0], 0)).toBe(mockLoadingData[0]);
  });

  it('should not call the `columnCellGuard` `renderCell` method if the row is loading', () => {
    const renderCell = vi.fn();
    const renderLoader = vi.fn();

    columnCellGuard({
      ctx: mockCellContext as MockCellContext,
      renderCell,
      renderLoader,
    });

    expect(renderCell).toHaveBeenCalledTimes(1);
    expect(renderLoader).not.toHaveBeenCalled();

    renderCell.mockClear();
    renderLoader.mockClear();

    columnCellGuard({
      ctx: mockLoadingCellContext as MockCellContext,
      renderCell,
      renderLoader,
    });

    expect(renderCell).not.toHaveBeenCalled();
    expect(renderLoader).toHaveBeenCalledTimes(1);
  });

  it('should not call the `columnHeaderGuard` `renderCell` if all rows are loading with `mode = all`', () => {
    const renderCell = vi.fn();
    const renderLoader = vi.fn();

    columnHeaderGuard<TData | DataTableLoadingObject, string>({
      ctx: mockHeaderContext as MockHeaderContext,
      mode: 'all',
      renderCell,
      renderLoader,
    });

    expect(renderCell).toHaveBeenCalledTimes(1);
    expect(renderLoader).not.toHaveBeenCalled();

    renderCell.mockClear();
    renderLoader.mockClear();

    columnHeaderGuard<TData | DataTableLoadingObject, string>({
      ctx: mockLoadingHeaderContext as MockHeaderContext,
      mode: 'all',
      renderCell,
      renderLoader,
    });

    expect(renderCell).not.toHaveBeenCalled();
    expect(renderLoader).toHaveBeenCalledTimes(1);
  });

  it('should not call the `columnHeaderGuard` `renderCell` if some rows are loading with `mode = some`', () => {
    const renderCell = vi.fn();
    const renderLoader = vi.fn();

    columnHeaderGuard<TData | DataTableLoadingObject, string>({
      ctx: mockSomeLoadingHeaderContext as MockHeaderContext,
      mode: 'some',
      renderCell,
      renderLoader,
    });

    expect(renderCell).not.toHaveBeenCalled();
    expect(renderLoader).toHaveBeenCalledTimes(1);
  });
});
