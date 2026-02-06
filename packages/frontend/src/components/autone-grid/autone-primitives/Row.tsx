import * as React from 'react';

import { cn } from '@/utils';
import { useHighlightedRow } from '../contexts/highlighted-row.context';
import { GridPrimitives } from '../primitives';

export interface AutoneRowProps {
  // eslint-disable-next-line react/no-unused-prop-types
  highlightOnMount?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  isDisabled?: boolean;
}

export const Row = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.Row>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.Row> & AutoneRowProps
  >(({ className, rowIndex, highlightOnMount, isDisabled, ...props }, ref) => {
    const highlightedRowIdxRef = useHighlightedRow();
    const [highlighted, setHighlighted] = React.useState(
      highlightOnMount && highlightedRowIdxRef.current !== rowIndex
    );

    React.useEffect(() => {
      if (highlighted) {
        const timeoutId = setTimeout(() => {
          setHighlighted(false);
        }, 6000);
        highlightedRowIdxRef.current = rowIndex;
        return () => clearTimeout(timeoutId);
      }
    }, [highlighted, highlightedRowIdxRef, rowIndex]);

    return (
      <GridPrimitives.Row
        className={cn(
          'transition-colors hover:bg-secondary border-b border-border',
          highlighted
            ? '[&_[role=gridcell]]:bg-primary/20 [&_[role=gridcell]]:animate-pulse [&_[role=gridcell]]:duration-[2000] [&_[role=gridcell]]:transition-colors'
            : 'group',
          className,
          isDisabled ? 'opacity-50 cursor-default' : ''
        )}
        ref={ref}
        rowIndex={rowIndex}
        {...props}
      />
    );
  })
);
Row.displayName = 'AutoneGrid.Row';

export const DynamicRow = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.DynamicRow>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.DynamicRow> & AutoneRowProps
  >(({ className, rowIndex, highlightOnMount, ...props }, ref) => {
    const [highlighted, setHighlighted] = React.useState(highlightOnMount);

    React.useEffect(() => {
      if (highlightOnMount) {
        const timeoutId = setTimeout(() => {
          setHighlighted(false);
        }, 6000);
        return () => clearTimeout(timeoutId);
      }
    }, [highlightOnMount]);

    return (
      <GridPrimitives.DynamicRow
        className={cn(
          'transition-colors hover:bg-secondary border-b border-border',
          highlighted
            ? '[&_[role=gridcell]]:bg-primary/20 [&_[role=gridcell]]:animate-pulse [&_[role=gridcell]]:duration-[2000] [&_[role=gridcell]]:transition-colors'
            : 'group',
          className
        )}
        ref={ref}
        rowIndex={rowIndex}
        {...props}
      />
    );
  })
);
DynamicRow.displayName = 'AutoneGrid.DynamicRow';
