import * as React from 'react';

import { cn } from '@/utils';
import { useIsReorderableRegion } from '../contexts/is-reorderable-region.context';
import { useReorderableDropzone } from '../hooks/use-reorderable-dropzone';
import { GridPrimitives } from '../primitives';

export interface AutoneCellProps {
  // eslint-disable-next-line react/no-unused-prop-types
  columnId: string;
  // eslint-disable-next-line react/no-unused-prop-types
  rowIndex: number;
}

const NonDndCell = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.Cell>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.Cell>
  >(({ className, cellRect, ...props }, ref) => {
    return (
      <GridPrimitives.Cell
        ref={ref}
        className={cn(
          'bg-white py-3 px-4 flex items-center text-sm',
          'group-hover:bg-secondary transition-colors border-b border-border',
          className
        )}
        cellRect={cellRect}
        {...props}
      />
    );
  })
);
NonDndCell.displayName = 'AutoneGrid.NonDndCell';

const DndCell = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.Cell>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.Cell> & AutoneCellProps
  >(({ className, columnId, rowIndex, cellRect, ...props }, ref) => {
    const { x, columnIsDragging, setNodeRef } = useReorderableDropzone(
      columnId,
      rowIndex,
      cellRect.x,
      ref
    );

    return (
      <NonDndCell
        ref={setNodeRef}
        className={cn(
          columnIsDragging && `z-[var(--autone-grid-body-dragging-z-index)]`,
          className
        )}
        style={{
          x,
        }}
        cellRect={cellRect}
        {...props}
      />
    );
  })
);
DndCell.displayName = 'AutoneGrid.DndCell';

export const Cell = React.forwardRef<
  React.ElementRef<typeof GridPrimitives.Cell>,
  React.ComponentPropsWithoutRef<typeof GridPrimitives.Cell> & AutoneCellProps
>(({ columnId, rowIndex, cellRect, ...props }, ref) => {
  const isReorderableRegion = useIsReorderableRegion();
  if (!isReorderableRegion) {
    return <NonDndCell ref={ref} cellRect={cellRect} {...props} />;
  }
  return (
    <DndCell ref={ref} columnId={columnId} rowIndex={rowIndex} cellRect={cellRect} {...props} />
  );
});
Cell.displayName = 'AutoneGrid.Cell';

const NonDndDynamicCell = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.DynamicCell>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.DynamicCell>
  >(({ className, cellRect, ...props }, ref) => {
    return (
      <GridPrimitives.DynamicCell
        ref={ref}
        className={cn(
          'bg-white py-3 px-4 flex items-center text-sm',
          'group-hover:bg-secondary transition-colors border-border',
          className
        )}
        cellRect={cellRect}
        {...props}
      />
    );
  })
);
NonDndDynamicCell.displayName = 'AutoneGrid.NonDndDynamicCell';

const DndDynamicCell = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.DynamicCell>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.DynamicCell> & AutoneCellProps
  >(({ className, columnId, rowIndex, cellRect, ...props }, ref) => {
    const { x, columnIsDragging, setNodeRef } = useReorderableDropzone(
      columnId,
      rowIndex,
      cellRect.x,
      ref
    );

    return (
      <NonDndDynamicCell
        ref={setNodeRef}
        className={cn(
          columnIsDragging && `z-[var(--autone-grid-body-dragging-z-index)]`,
          className
        )}
        style={{
          x,
        }}
        cellRect={cellRect}
        {...props}
      />
    );
  })
);
DndDynamicCell.displayName = 'AutoneGrid.DndDynamicCell';

export const DynamicCell = React.forwardRef<
  React.ElementRef<typeof GridPrimitives.DynamicCell>,
  React.ComponentPropsWithoutRef<typeof GridPrimitives.DynamicCell> & AutoneCellProps
>(({ columnId, rowIndex, cellRect, ...props }, ref) => {
  const isReorderableRegion = useIsReorderableRegion();
  if (!isReorderableRegion) {
    return <NonDndDynamicCell ref={ref} cellRect={cellRect} {...props} />;
  }
  return (
    <DndDynamicCell
      ref={ref}
      columnId={columnId}
      rowIndex={rowIndex}
      cellRect={cellRect}
      {...props}
    />
  );
});
DynamicCell.displayName = 'AutoneGrid.DynamicCell';
