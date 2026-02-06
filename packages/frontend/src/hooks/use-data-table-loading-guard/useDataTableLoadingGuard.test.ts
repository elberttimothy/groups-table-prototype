import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { isDataTableLoadingObject } from '@/utils';

import { useDataTableLoadingGuard } from './useDataTableLoadingGuard';

describe('useDataTableLoadingGuard Testing Suite', () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const expectedLoadingRowCount = 20;

  it('should not crash', () => {
    renderHook(() =>
      useDataTableLoadingGuard({
        mode: 'dynamic',
        isLoading: false,
        data: [],
        initialRowCount: 5,
      })
    );

    expect(true).toBe(true);
  });

  describe.each([{ mode: 'dynamic' }, { mode: 'fixed' }] as const)(
    'common functionality',
    ({ mode }) => {
      const extraProps =
        mode === 'dynamic'
          ? ({ mode, initialRowCount: expectedLoadingRowCount } as const)
          : ({ mode, rowCount: expectedLoadingRowCount } as const);

      it.each([
        { isLoading: true, isFetching: false, isUninitialized: false },
        { isLoading: false, isFetching: true, isUninitialized: false },
        { isLoading: false, isFetching: false, isUninitialized: true },
      ])(
        'should return initialRowCount loading objects when data is empty and any of the boolean props are true',
        ({ isLoading, isFetching, isUninitialized }) => {
          const { result } = renderHook(() =>
            useDataTableLoadingGuard({
              isLoading,
              isFetching,
              isUninitialized,
              data: [],
              ...extraProps,
            })
          );
          expect(result.current.memoisedData).toHaveLength(expectedLoadingRowCount);
          expect(result.current.memoisedData.every((item) => isDataTableLoadingObject(item))).toBe(
            true
          );
        }
      );

      it('should return actual data when isLoading is false', () => {
        const { result } = renderHook(() =>
          useDataTableLoadingGuard({
            isLoading: false,
            data,
            ...extraProps,
          })
        );

        expect(result.current.memoisedData).toEqual(data);
        expect(result.current.memoisedData.every((item) => 'id' in item)).toBe(true);
      });
    }
  );

  describe('dynamic mode', () => {
    it('should fallback to initialRowCount if isLoading is true and data is empty', () => {
      const { result } = renderHook(() =>
        useDataTableLoadingGuard({
          mode: 'dynamic',
          isLoading: true,
          data: [],
          initialRowCount: expectedLoadingRowCount,
        })
      );

      expect(result.current.memoisedData).toHaveLength(expectedLoadingRowCount);
      expect(result.current.memoisedData.every((item) => isDataTableLoadingObject(item))).toBe(
        true
      );
    });

    it('should return data length loading objects when data is not empty and isLoading is true', () => {
      const { result } = renderHook(() =>
        useDataTableLoadingGuard({
          mode: 'dynamic',
          isLoading: true,
          data,
          initialRowCount: expectedLoadingRowCount,
        })
      );
      expect(result.current.memoisedData).toHaveLength(data.length);
      expect(result.current.memoisedData.every((item) => isDataTableLoadingObject(item))).toBe(
        true
      );
    });
  });

  describe('fixed mode', () => {
    it('should always return rowCount loading objects when isLoading is true, regardless of data length', () => {
      const { result } = renderHook(() =>
        useDataTableLoadingGuard({
          mode: 'fixed',
          isLoading: true,
          data,
          rowCount: expectedLoadingRowCount,
        })
      );
      expect(result.current.memoisedData).toHaveLength(expectedLoadingRowCount);
      expect(result.current.memoisedData.every((item) => isDataTableLoadingObject(item))).toBe(
        true
      );
    });
  });
});
