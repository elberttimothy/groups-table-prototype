import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import './AutoneGrid.css';

import { AutoneGrid } from './autone-primitives';
import {
  BodyPreset,
  FooterPreset,
  HeaderPreset,
} from './autone-primitives/Presets';
import { useDataGrid } from './hooks/use-data-grid/useDataGrid';
import { columns } from './mocks/columns';
import { mockProducts } from './mocks/mock-data';
import { assertNoGroupColumnDefs } from './utilities/invariants';

import '@vitest/browser/matchers.d.ts';

const AutoneGridTest = () => {
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
  const virtualFooters = gridState.getVirtualFooters();

  return (
    <AutoneGrid.Root
      data-testid="autone-grid"
      className="w-[700px] h-[450px] bg-white"
      gridConfig={gridConfig}
      ref={scrollElementRef}
    >
      <HeaderPreset virtualHeaders={virtualHeaders} />
      <BodyPreset virtualRows={virtualRows} />
      <FooterPreset virtualFooters={virtualFooters} />
    </AutoneGrid.Root>
  );
};

// 1 left pinned, 1 center, 2 right pinned columns
const wideTableColumns = assertNoGroupColumnDefs([
  columns[0], // sku - left pinned
  columns[1], // name - center
  columns[5], // status - right pinned
  columns[9], // rating - right pinned
]);

const WideTableWithPinningTest = () => {
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
      row: 5,
      col: 2,
    },
  });

  const virtualHeaders = gridState.getVirtualHeaders();
  const virtualRows = gridState.getVirtualRows();
  const virtualFooters = gridState.getVirtualFooters();

  return (
    <AutoneGrid.Root
      data-testid="autone-grid-wide"
      className="w-[1200px] h-[450px] bg-white"
      gridConfig={gridConfig}
      ref={scrollElementRef}
    >
      <HeaderPreset virtualHeaders={virtualHeaders} />
      <BodyPreset virtualRows={virtualRows} />
      <FooterPreset virtualFooters={virtualFooters} />
    </AutoneGrid.Root>
  );
};

const mockProducts2Rows = mockProducts.slice(0, 2);

const TotalRowHeightLessThanTableTest = () => {
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
  const virtualFooters = gridState.getVirtualFooters();

  return (
    <AutoneGrid.Root
      data-testid="autone-grid"
      className="w-[700px] h-[450px] bg-white"
      gridConfig={gridConfig}
      ref={scrollElementRef}
    >
      <HeaderPreset virtualHeaders={virtualHeaders} />
      <BodyPreset virtualRows={virtualRows} />
      <FooterPreset virtualFooters={virtualFooters} />
    </AutoneGrid.Root>
  );
};

describe('AutoneGrid', () => {
  afterEach(() => cleanup());

  test('should match screenshot', async () => {
    const { baseElement } = render(<AutoneGridTest />);
    await expect
      .element(page.elementLocator(baseElement))
      .toMatchScreenshot('autone-grid-start');

    screen.getByTestId('autone-grid').scrollBy({ left: 1000 });
    await expect
      .element(page.elementLocator(baseElement))
      .toMatchScreenshot('autone-grid-scrolled');
  });

  test('wide table with pinning should match screenshot', async () => {
    const { baseElement } = render(<WideTableWithPinningTest />);
    await expect
      .element(page.elementLocator(baseElement))
      .toMatchScreenshot('autone-grid-wide-pinning-start');

    screen.getByTestId('autone-grid-wide').scrollBy({ left: 1000 });
    await expect
      .element(page.elementLocator(baseElement))
      .toMatchScreenshot('autone-grid-wide-pinning-scrolled');
  });

  test('total row height less than table height should match screenshot', async () => {
    const { baseElement } = render(<TotalRowHeightLessThanTableTest />);
    await expect
      .element(page.elementLocator(baseElement))
      .toMatchScreenshot('autone-grid-total-row-height-less-than-table', {
        comparatorOptions: {
          threshold: 0.001,
        },
      });

    screen.getByTestId('autone-grid').scrollBy({ left: 1000 });
    await expect
      .element(page.elementLocator(baseElement))
      .toMatchScreenshot(
        'autone-grid-total-row-height-less-than-table-scrolled',
        {
          comparatorOptions: {
            threshold: 0.001,
          },
        },
      );
  });
});
