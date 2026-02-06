import { useDndContext, useDroppable } from '@dnd-kit/core';
import { useMotionValueEvent } from 'motion/react';
import React from 'react';

import { createDroppableId } from '../../utilities/dnd-column-reordering';
import { useFlipMotionValue } from '../use-flip-motion-value';

export const useReorderableDropzone = (
  columnId: string,
  rowIndex: number,
  currentX: number,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const dndContext = useDndContext();
  const droppableId = createDroppableId(columnId, rowIndex.toString());
  const droppable = useDroppable({
    id: droppableId,
    disabled: isAnimating,
  });

  const columnIsDragging = dndContext.active?.id === columnId;

  const setNodeRef = React.useCallback(
    (node: HTMLDivElement) => {
      droppable.setNodeRef(node);
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
    },
    [droppable, ref]
  );

  const x = useFlipMotionValue(currentX, columnIsDragging);

  useMotionValueEvent(
    x,
    'animationStart',
    React.useCallback(() => {
      setIsAnimating(true);
    }, [])
  );
  useMotionValueEvent(
    x,
    'animationComplete',
    React.useCallback(() => {
      setIsAnimating(false);
      dndContext.measureDroppableContainers([droppableId]);
    }, [dndContext, droppableId])
  );

  return { x, columnIsDragging, setNodeRef };
};
