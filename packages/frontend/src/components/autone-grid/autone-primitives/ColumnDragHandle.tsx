import { GripVertical } from 'lucide-react';
import React, { type HTMLAttributes } from 'react';

import { cn } from '@/utils';
import { useColumnDragHandle } from '../contexts/column-drag-handle.context';
import { useIsReorderableRegion } from '../contexts/is-reorderable-region.context';

const ColumnDragHandleImpl = React.memo(
  React.forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => {
      const draggable = useColumnDragHandle();

      return (
        <button
          type="button"
          ref={ref}
          className={cn(
            'relative text-secondary-foreground opacity-25 group-hover:opacity-80 w-4 h-fit transition-opacity shrink-0 hover:cursor-grab active:cursor-grabbing',
            draggable.isDragging && 'opacity-80',
            className
          )}
          {...props}
          {...draggable.listeners}
          {...draggable.attributes}
        >
          <GripVertical
            size={16}
            // force center the icon
            className="text-inherit"
          />
        </button>
      );
    }
  )
);
ColumnDragHandleImpl.displayName = 'AutoneGrid.ColumnDragHandleImpl';

export const ColumnDragHandle = React.memo(
  React.forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => {
      const isReorderableRegion = useIsReorderableRegion();

      if (!isReorderableRegion) {
        return null;
      }

      return <ColumnDragHandleImpl ref={ref} className={className} {...props} />;
    }
  )
);
ColumnDragHandle.displayName = 'AutoneGrid.ColumnDragHandle';
