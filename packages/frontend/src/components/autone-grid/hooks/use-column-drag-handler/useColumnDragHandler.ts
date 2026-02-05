import { type DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import React from 'react';

import { getColumnIdFromDroppableId } from '../../utilities/dnd-column-reordering';

interface UseColumnDragHandlerProps {
  columnOrder: string[];
  onColumnOrderChange: (columnOrder: string[]) => void;
  onColumnMeasure: () => void;
}

/**
 * Creates a callback to handle drag-over events. Uses cursor movement to determine if the triggered drag
 * is congruent with user intent.
 */
export const useColumnDragHandler = ({
  columnOrder,
  onColumnOrderChange,
  onColumnMeasure,
}: UseColumnDragHandlerProps) => {
  const lastClientX = React.useRef<number | null>(null);

  const handleDragMove = React.useCallback(
    (e: DragOverEvent) => {
      // measure mouse x-movement since last event
      const clientRelativeX = e.delta.x;
      const deltaX = lastClientX.current
        ? clientRelativeX - lastClientX.current
        : clientRelativeX;
      lastClientX.current = clientRelativeX;

      // if not over anything, short circuit
      const { active, over } = e;
      if (!over) return;

      const activeId = getColumnIdFromDroppableId(active.id.toString());
      const overId = getColumnIdFromDroppableId(over.id.toString());

      const activeIndex = columnOrder.findIndex((item) => item === activeId);
      const overIndex = columnOrder.findIndex((item) => item === overId);

      // if swap direction does not match the direction of the mouse movement, short circuit
      if (activeIndex === -1 || overIndex === -1) return;
      if (
        !(
          (deltaX > 0 && activeIndex < overIndex) ||
          (deltaX < 0 && activeIndex > overIndex)
        )
      )
        return;

      const newColumnOrder = arrayMove(columnOrder, activeIndex, overIndex);

      // update the tanstack flat column order, trigger a measure event
      onColumnOrderChange(newColumnOrder);
      onColumnMeasure();
    },
    [columnOrder, onColumnOrderChange, onColumnMeasure],
  );

  const handleDragEnd = React.useCallback(() => {
    lastClientX.current = null;
  }, []);

  return { handleDragEnd, handleDragMove };
};
