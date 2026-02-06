import { motion } from 'motion/react';
import { type ComponentProps, forwardRef, useCallback } from 'react';

import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';
import { type RowRect } from '../hooks/use-data-grid/useDataGrid.types';
import { cssVariables } from '../utilities/css-variables';

export interface RowProps {
  rowRect: RowRect;
  rowIndex: number;
}

export const Row = forwardRef<
  React.ElementRef<typeof motion.div>,
  ComponentProps<typeof motion.div> & RowProps
>(({ children, rowRect, rowIndex, className, style, ...props }, ref) => {
  const { rowWidth } = useGridContext();

  return (
    <motion.div
      ref={ref}
      role="row"
      aria-rowindex={rowIndex + 1}
      className={cn(`absolute flex flex-row`, className)}
      style={{
        width: rowWidth,
        minWidth: `var(${cssVariables.rootWidthVar})`,
        ...rowRect,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
Row.displayName = 'Row';

export interface DynamicRowProps {
  rowIndex: number;
  rowRect: RowRect;
}

export const DynamicRow = forwardRef<
  React.ElementRef<typeof motion.div>,
  ComponentProps<typeof motion.div> & DynamicRowProps
>(({ children, rowIndex, rowRect, className, style, ...props }, ref) => {
  const { rowVirtualiser } = useGridContext();

  const combineRefs = useCallback(
    (el: HTMLDivElement) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(el);
        } else {
          ref.current = el;
        }
      }
      rowVirtualiser.measureElement(el);
    },
    [ref, rowVirtualiser]
  );

  return (
    <motion.div
      ref={combineRefs}
      role="row"
      data-index={rowIndex}
      aria-rowindex={rowIndex + 1}
      className={cn(`flex flex-row`, className)}
      style={{
        position: 'absolute',
        minWidth: `var(${cssVariables.rootWidthVar})`,
        y: rowRect.y,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
DynamicRow.displayName = 'DynamicRow';
