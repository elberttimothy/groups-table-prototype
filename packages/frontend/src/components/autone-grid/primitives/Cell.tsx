import { motion } from 'motion/react';
import React, { type ComponentProps, forwardRef } from 'react';

import { cn } from '@/utils';
import { type CellRect } from '../hooks/use-data-grid/useDataGrid.types';

export interface CellProps {
  cellRect: CellRect;
  colIndex: number;
}

export const Cell = React.forwardRef<
  HTMLDivElement,
  ComponentProps<typeof motion.div> & CellProps
>(({ className, children, cellRect, colIndex, style, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      role="gridcell"
      aria-colindex={colIndex + 1}
      className={cn('absolute bg-white', className)}
      style={{
        position: cellRect.position,
        width: cellRect.width,
        height: cellRect.height,
        left: cellRect.x,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
Cell.displayName = 'Cell';

export interface DynamicCellProps {
  colIndex: number;
  cellRect: CellRect;
}

export const DynamicCell = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof motion.div> & DynamicCellProps
>(({ className, children, colIndex, cellRect, style, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      role="gridcell"
      data-index={colIndex}
      aria-colindex={colIndex + 1}
      className={cn('flex bg-white', className)}
      style={{
        width: cellRect.width,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
