import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useMotionValueEvent } from 'motion/react';
import * as React from 'react';

import { cn } from '@/utils';
import { ColumnDragHandleContextProvider } from '../contexts/column-drag-handle.context';
import { useIsReorderableRegion } from '../contexts/is-reorderable-region.context';
import { useFlipMotionValue } from '../hooks/use-flip-motion-value';
import { GridPrimitives } from '../primitives';
import { createDroppableId } from '../utilities/dnd-column-reordering';

export interface AutoneHeaderCellProps {
  // eslint-disable-next-line react/no-unused-prop-types
  columnId: string;
  // eslint-disable-next-line react/no-unused-prop-types
  droppableContext?: string;
}

const NonDndHeaderCell = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.HeaderCell>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.HeaderCell>
  >(({ className, headerRect, ...props }, ref) => {
    return (
      <GridPrimitives.HeaderCell
        ref={ref}
        className={cn(
          'py-3 px-4 bg-secondary text-sm flex leading-none items-center cursor-default',
          className
        )}
        headerRect={headerRect}
        {...props}
      />
    );
  })
);
NonDndHeaderCell.displayName = 'AutoneGrid.NonDndHeaderCell';

const DndHeaderCell = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.HeaderCell>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.HeaderCell> & AutoneHeaderCellProps
  >(({ className, columnId, droppableContext = 'header', headerRect, ...props }, ref) => {
    const [isAnimating, setIsAnimating] = React.useState(false);

    const dndContext = useDndContext();
    const draggable = useDraggable({
      id: columnId,
    });
    const droppableId = createDroppableId(columnId, droppableContext);
    const droppable = useDroppable({
      id: droppableId,
      disabled: isAnimating,
    });

    const setNodeRef = React.useCallback(
      (node: HTMLDivElement) => {
        draggable.setNodeRef(node);
        droppable.setNodeRef(node);
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      },
      [draggable, droppable, ref]
    );

    const x = useFlipMotionValue(headerRect.x, draggable.isDragging);

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

    return (
      <ColumnDragHandleContextProvider draggable={draggable}>
        <GridPrimitives.HeaderCell
          ref={setNodeRef}
          className={cn(
            'relative group px-4 py-3 bg-secondary text-sm flex flex-row items-center',
            draggable.isDragging && `z-[var(--autone-grid-header-dragging-z-index)]`,
            className
          )}
          style={{
            x,
          }}
          headerRect={headerRect}
          {...props}
        />
      </ColumnDragHandleContextProvider>
    );
  })
);
DndHeaderCell.displayName = 'AutoneGrid.DndHeaderCell';

export const HeaderCell = ({
  columnId,
  droppableContext,
  headerRect,
  ...props
}: React.ComponentPropsWithoutRef<typeof GridPrimitives.HeaderCell> & AutoneHeaderCellProps) => {
  const isReorderableRegion = useIsReorderableRegion();

  if (!isReorderableRegion) {
    return <NonDndHeaderCell headerRect={headerRect} {...props} />;
  }

  return (
    <>
      <DndHeaderCell
        columnId={columnId}
        droppableContext={droppableContext}
        headerRect={headerRect}
        {...props}
      />
    </>
  );
};
