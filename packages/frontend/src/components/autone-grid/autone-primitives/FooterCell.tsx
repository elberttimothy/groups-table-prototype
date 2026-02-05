import { useDndContext } from '@dnd-kit/core';
import * as React from 'react';

import { cn } from '@/utils';
import { useFlipMotionValue } from '../hooks/use-flip-motion-value';
import { GridPrimitives } from '../primitives';

export interface AutoneFooterCellProps {
  // eslint-disable-next-line react/no-unused-prop-types
  columnId: string;
}

export const FooterCell = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.FooterCell>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.FooterCell> &
      AutoneFooterCellProps
  >(({ className, columnId, footerRect, ...props }, ref) => {
    const dndContext = useDndContext();
    const isDragging = React.useMemo(() => {
      return dndContext.active?.id === columnId;
    }, [dndContext.active?.id, columnId]);

    const x = useFlipMotionValue(footerRect.x, isDragging);

    return (
      <GridPrimitives.FooterCell
        ref={ref}
        className={cn(
          'py-3 px-4 bg-accent text-sm flex items-center',
          isDragging && `z-[var(--autone-grid-footer-dragging-z-index)]`,
          className,
        )}
        style={{
          x,
        }}
        footerRect={footerRect}
        {...props}
      />
    );
  }),
);
FooterCell.displayName = 'AutoneGrid.FooterCell';
