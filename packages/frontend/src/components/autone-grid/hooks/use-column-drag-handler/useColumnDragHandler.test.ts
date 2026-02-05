import { type DragOverEvent } from '@dnd-kit/core';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createDroppableId } from '../../utilities/dnd-column-reordering';

import { useColumnDragHandler } from './useColumnDragHandler';

// ============================================================================
// TEST HELPERS
// ============================================================================

const CTX = 'test-ctx';

const createMockDragEvent = (
  activeId: string,
  overId: string | null,
  deltaX: number,
): DragOverEvent =>
  ({
    active: { id: createDroppableId(activeId, CTX) },
    over: overId ? { id: createDroppableId(overId, CTX) } : null,
    delta: { x: deltaX, y: 0 },
  }) as unknown as DragOverEvent;

// ============================================================================
// useColumnDragHandler TESTS
// ============================================================================

describe('useColumnDragHandler', () => {
  // ==========================================================================
  // handleDragMove TESTS - SHORT CIRCUITS
  // ==========================================================================

  describe('handleDragMove short circuits', () => {
    it('does not reorder when over is null', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', null, 100));
      });

      expect(onColumnOrderChange).not.toHaveBeenCalled();
      expect(onColumnMeasure).not.toHaveBeenCalled();
    });

    it('does not reorder when active column is not found in order', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      act(() => {
        result.current.handleDragMove(
          createMockDragEvent('unknown', 'col2', 100),
        );
      });

      expect(onColumnOrderChange).not.toHaveBeenCalled();
      expect(onColumnMeasure).not.toHaveBeenCalled();
    });

    it('does not reorder when over column is not found in order', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      act(() => {
        result.current.handleDragMove(
          createMockDragEvent('col1', 'unknown', 100),
        );
      });

      expect(onColumnOrderChange).not.toHaveBeenCalled();
      expect(onColumnMeasure).not.toHaveBeenCalled();
    });

    it('does not reorder when dragging left but active is already left of over', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      // col1 is at index 0, col2 is at index 1
      // Dragging left (negative delta) but col1 < col2, so should not swap
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', -50));
      });

      expect(onColumnOrderChange).not.toHaveBeenCalled();
      expect(onColumnMeasure).not.toHaveBeenCalled();
    });

    it('does not reorder when dragging right but active is already right of over', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      // col3 is at index 2, col2 is at index 1
      // Dragging right (positive delta) but col3 > col2, so should not swap
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col3', 'col2', 50));
      });

      expect(onColumnOrderChange).not.toHaveBeenCalled();
      expect(onColumnMeasure).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // handleDragMove TESTS - SUCCESSFUL REORDER
  // ==========================================================================

  describe('handleDragMove successful reorder', () => {
    it('reorders columns when dragging right to a later position', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      // col1 is at index 0, col3 is at index 2
      // Dragging right (positive delta) and col1 < col3, should swap
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col3', 100));
      });

      expect(onColumnOrderChange).toHaveBeenCalledWith([
        'col2',
        'col3',
        'col1',
      ]);
      expect(onColumnMeasure).toHaveBeenCalled();
    });

    it('reorders columns when dragging left to an earlier position', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      // col3 is at index 2, col1 is at index 0
      // Dragging left (negative delta) and col3 > col1, should swap
      act(() => {
        result.current.handleDragMove(
          createMockDragEvent('col3', 'col1', -100),
        );
      });

      expect(onColumnOrderChange).toHaveBeenCalledWith([
        'col3',
        'col1',
        'col2',
      ]);
      expect(onColumnMeasure).toHaveBeenCalled();
    });

    it('reorders adjacent columns when dragging right', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', 50));
      });

      expect(onColumnOrderChange).toHaveBeenCalledWith([
        'col2',
        'col1',
        'col3',
      ]);
      expect(onColumnMeasure).toHaveBeenCalled();
    });

    it('reorders adjacent columns when dragging left', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      act(() => {
        result.current.handleDragMove(createMockDragEvent('col2', 'col1', -50));
      });

      expect(onColumnOrderChange).toHaveBeenCalledWith([
        'col2',
        'col1',
        'col3',
      ]);
      expect(onColumnMeasure).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // handleDragMove TESTS - DELTA CALCULATION
  // ==========================================================================

  describe('handleDragMove delta calculation', () => {
    it('calculates delta correctly on first move', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      // First move with deltaX = 100, should trigger swap (moving right)
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', 100));
      });

      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
    });

    it('calculates delta correctly on subsequent moves', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      // First move: deltaX = 50, lastClientX becomes 50
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', 50));
      });

      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
      onColumnOrderChange.mockClear();

      // Second move: deltaX = 100 (cumulative), delta from last = 100 - 50 = 50 (positive)
      // This should trigger another swap if direction is consistent
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', 100));
      });

      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
    });

    it('does not swap when delta direction reverses', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      // First move: deltaX = 100
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', 100));
      });

      onColumnOrderChange.mockClear();
      onColumnMeasure.mockClear();

      // Second move: deltaX = 50 (delta from last = 50 - 100 = -50, negative)
      // col1 (index 0) trying to move to col2 (index 1) but with negative delta
      // Since col1 < col2, needs positive delta. Should not swap.
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', 50));
      });

      expect(onColumnOrderChange).not.toHaveBeenCalled();
      expect(onColumnMeasure).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // handleDragEnd TESTS
  // ==========================================================================

  describe('handleDragEnd', () => {
    it('resets lastClientX ref on drag end', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result } = renderHook(() =>
        useColumnDragHandler({
          columnOrder: ['col1', 'col2', 'col3'],
          onColumnOrderChange,
          onColumnMeasure,
        }),
      );

      // First drag: move right
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', 100));
      });

      // End drag
      act(() => {
        result.current.handleDragEnd();
      });

      onColumnOrderChange.mockClear();
      onColumnMeasure.mockClear();

      // New drag: deltaX = 50 should be treated as first move (not relative to 100)
      // So delta = 50 (positive), col1 -> col2 should swap
      act(() => {
        result.current.handleDragMove(createMockDragEvent('col1', 'col2', 50));
      });

      expect(onColumnOrderChange).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // CALLBACK STABILITY TESTS
  // ==========================================================================

  describe('callback stability', () => {
    it('handleDragMove changes when dependencies change', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result, rerender } = renderHook(
        ({ columnOrder }) =>
          useColumnDragHandler({
            columnOrder,
            onColumnOrderChange,
            onColumnMeasure,
          }),
        { initialProps: { columnOrder: ['col1', 'col2', 'col3'] } },
      );

      const initialHandleDragMove = result.current.handleDragMove;

      rerender({ columnOrder: ['col3', 'col2', 'col1'] });

      expect(result.current.handleDragMove).not.toBe(initialHandleDragMove);
    });

    it('handleDragEnd remains stable across renders', () => {
      const onColumnOrderChange = vi.fn();
      const onColumnMeasure = vi.fn();

      const { result, rerender } = renderHook(
        ({ columnOrder }) =>
          useColumnDragHandler({
            columnOrder,
            onColumnOrderChange,
            onColumnMeasure,
          }),
        { initialProps: { columnOrder: ['col1', 'col2', 'col3'] } },
      );

      const initialHandleDragEnd = result.current.handleDragEnd;

      rerender({ columnOrder: ['col3', 'col2', 'col1'] });

      expect(result.current.handleDragEnd).toBe(initialHandleDragEnd);
    });
  });
});
