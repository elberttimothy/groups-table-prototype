import { type Header, type RowData } from '@tanstack/react-table';
import { describe, expect, it } from 'vitest';

import { type AnyHeader } from '../AutoneGrid.types';

import { getDynamicColumnWidths } from './dynamic-widths';

// ============================================================================
// TEST HELPERS
// ============================================================================

type MockHeader<TData extends RowData = unknown, TValue = unknown> = Pick<
  Header<TData, TValue>,
  'id' | 'getSize'
>;

const createMockHeader = (id: string, size: number): MockHeader => ({
  id,
  getSize: () => size,
});

// ============================================================================
// getDynamicColumnWidths TESTS
// ============================================================================

describe('getDynamicColumnWidths', () => {
  // ==========================================================================
  // NULL VIEWPORT (NO MEASUREMENT)
  // ==========================================================================

  describe('when viewportWidth is null', () => {
    it('returns pre-defined sizes for all headers', () => {
      const headers = [
        createMockHeader('col1', 100),
        createMockHeader('col2', 150),
        createMockHeader('col3', 200),
      ];

      const result = getDynamicColumnWidths(headers as AnyHeader[], null);

      expect(result).toEqual([100, 150, 200]);
    });

    it('handles empty headers array', () => {
      const headers: MockHeader[] = [];

      const result = getDynamicColumnWidths(headers as AnyHeader[], null);

      expect(result).toEqual([]);
    });

    it('handles single header', () => {
      const headers = [createMockHeader('col1', 250)];

      const result = getDynamicColumnWidths(headers as AnyHeader[], null);

      expect(result).toEqual([250]);
    });
  });

  // ==========================================================================
  // VIEWPORT WIDTH >= TOTAL HEADER WIDTH (NO DISTRIBUTION)
  // ==========================================================================

  describe('when total header width >= viewport width', () => {
    it('returns pre-defined sizes when total equals viewport', () => {
      const headers = [
        createMockHeader('col1', 100),
        createMockHeader('col2', 200),
        createMockHeader('col3', 200),
      ];
      const viewportWidth = 500; // equals total

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      expect(result).toEqual([100, 200, 200]);
    });

    it('returns pre-defined sizes when total exceeds viewport', () => {
      const headers = [
        createMockHeader('col1', 300),
        createMockHeader('col2', 400),
        createMockHeader('col3', 500),
      ];
      const viewportWidth = 800; // less than total (1200)

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      expect(result).toEqual([300, 400, 500]);
    });
  });

  // ==========================================================================
  // VIEWPORT WIDTH > TOTAL HEADER WIDTH (PROPORTIONAL DISTRIBUTION)
  // ==========================================================================

  describe('when total header width < viewport width', () => {
    it('distributes widths proportionally to fill viewport', () => {
      const headers = [
        createMockHeader('col1', 100), // 25% of 400
        createMockHeader('col2', 100), // 25% of 400
        createMockHeader('col3', 200), // 50% of 400
      ];
      const viewportWidth = 800; // 2x total (400)

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      // Each column should be scaled by 2x
      expect(result).toEqual([200, 200, 400]);
    });

    it('maintains proportions when scaling', () => {
      const headers = [
        createMockHeader('col1', 50), // 10%
        createMockHeader('col2', 150), // 30%
        createMockHeader('col3', 300), // 60%
      ];
      const viewportWidth = 1000; // total is 500

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      // Scale factor is 2x
      expect(result).toEqual([100, 300, 600]);
    });

    it('handles single column filling entire viewport', () => {
      const headers = [createMockHeader('col1', 100)];
      const viewportWidth = 500;

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      expect(result).toEqual([500]);
    });

    it('handles equal-width columns', () => {
      const headers = [
        createMockHeader('col1', 100),
        createMockHeader('col2', 100),
        createMockHeader('col3', 100),
        createMockHeader('col4', 100),
      ];
      const viewportWidth = 800; // total is 400

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      // Each column should be 200 (800 / 4)
      expect(result).toEqual([200, 200, 200, 200]);
    });

    it('handles fractional widths correctly', () => {
      const headers = [
        createMockHeader('col1', 100),
        createMockHeader('col2', 100),
        createMockHeader('col3', 100),
      ];
      const viewportWidth = 1000; // total is 300, scale factor ~3.33

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      // Sum should equal viewport width
      const sum = result.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1000, 10);

      // Each should be ~333.33
      expect(result[0]).toBeCloseTo(333.33, 2);
      expect(result[1]).toBeCloseTo(333.33, 2);
      expect(result[2]).toBeCloseTo(333.33, 2);
    });
  });

  // ==========================================================================
  // EDGE CASES
  // ==========================================================================

  describe('edge cases', () => {
    it('handles zero-width viewport', () => {
      const headers = [createMockHeader('col1', 100), createMockHeader('col2', 200)];
      const viewportWidth = 0;

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      // Total (300) >= viewport (0), so use pre-defined sizes
      expect(result).toEqual([100, 200]);
    });

    it('handles very small viewport', () => {
      const headers = [createMockHeader('col1', 100), createMockHeader('col2', 200)];
      const viewportWidth = 1;

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      // Total (300) >= viewport (1), so use pre-defined sizes
      expect(result).toEqual([100, 200]);
    });

    it('handles very large viewport', () => {
      const headers = [createMockHeader('col1', 100), createMockHeader('col2', 100)];
      const viewportWidth = 10000;

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      // Scale factor is 50x
      expect(result).toEqual([5000, 5000]);
    });

    it('handles zero-width headers', () => {
      const headers = [
        createMockHeader('col1', 0),
        createMockHeader('col2', 100),
        createMockHeader('col3', 0),
      ];
      const viewportWidth = 200;

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      // Total is 100, viewport is 200, so scale by 2x
      // col1: 0 * 2 = 0, col2: 100 * 2 = 200, col3: 0 * 2 = 0
      expect(result).toEqual([0, 200, 0]);
    });

    it('preserves header order in array', () => {
      const headers = [
        createMockHeader('z', 100),
        createMockHeader('a', 200),
        createMockHeader('m', 150),
      ];
      const viewportWidth = null;

      const result = getDynamicColumnWidths(headers as AnyHeader[], viewportWidth);

      expect(result).toEqual([100, 200, 150]);
    });
  });
});
