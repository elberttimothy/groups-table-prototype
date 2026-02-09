import {
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import * as React from 'react';

import { cn } from '@/utils';
import { HighlightedRowContextProvider } from '../contexts/highlighted-row.context';
import { IsReorderableRegionContextProvider } from '../contexts/is-reorderable-region.context';
import { useColumnDragHandler } from '../hooks/use-column-drag-handler';
import { GridPrimitives } from '../primitives';
import { pointerWithinAccountingOverlay } from '../utilities/dnd-column-reordering';

const DndRoot = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.Root>
  >(({ className, gridConfig, ...props }, ref) => {
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(TouchSensor),
      useSensor(KeyboardSensor)
    );
    const { table, columnVirtualiser } = gridConfig;

    const { handleDragMove, handleDragEnd } = useColumnDragHandler({
      columnOrder: table.getState().columnOrder,
      onColumnOrderChange: table.setColumnOrder,
      onColumnMeasure: columnVirtualiser.measure,
    });

    return (
      <HighlightedRowContextProvider>
        <IsReorderableRegionContextProvider reorderable>
          <DndContext
            sensors={sensors}
            autoScroll={{ threshold: { x: 0.2, y: 0 } }}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            collisionDetection={pointerWithinAccountingOverlay}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <GridPrimitives.Root
              className={cn('no-scrollbar min-h-0 h-full w-full border-b', className)}
              gridConfig={gridConfig}
              ref={ref}
              {...props}
            />
          </DndContext>
        </IsReorderableRegionContextProvider>
      </HighlightedRowContextProvider>
    );
  })
);
DndRoot.displayName = 'AutoneGrid.DndRoot';

const NonDndRoot = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.Root>
  >(({ className, ...props }, ref) => (
    <IsReorderableRegionContextProvider reorderable={false}>
      <GridPrimitives.Root
        className={cn('no-scrollbar min-h-0 h-full w-full border-b', className)}
        ref={ref}
        {...props}
      />
    </IsReorderableRegionContextProvider>
  ))
);
NonDndRoot.displayName = 'AutoneGrid.NonDndRoot';

/**
 * The root component of the AutoneGrid.
 * @param disableColumnDnd - Whether to disable column drag and drop.
 */
export const Root = React.forwardRef<
  React.ElementRef<typeof GridPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof GridPrimitives.Root> & {
    disableColumnDnd?: boolean;
  }
>(({ disableColumnDnd = false, ...props }, ref) => {
  if (disableColumnDnd) {
    return <NonDndRoot ref={ref} {...props} />;
  }
  return <DndRoot ref={ref} {...props} />;
});
Root.displayName = 'AutoneGrid.Root';
