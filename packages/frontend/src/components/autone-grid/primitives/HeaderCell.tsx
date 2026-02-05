import { motion } from 'motion/react';
import { type ComponentProps, forwardRef } from 'react';

import { cn } from '@/utils';
import { type HeaderRect } from '../hooks/use-data-grid/useDataGrid.types';

export interface HeaderCellProps {
  headerRect: HeaderRect;
  colIndex: number;
}

export const HeaderCell = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof motion.div> & HeaderCellProps
>(({ children, headerRect, colIndex, className, style, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      role="columnheader"
      data-index={colIndex}
      aria-rowspan={1}
      aria-colspan={1}
      aria-colindex={colIndex + 1}
      className={cn('absolute bg-white', className)}
      style={{
        position: headerRect.position,
        width: headerRect.width,
        height: headerRect.height,
        left: headerRect.x,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
HeaderCell.displayName = 'HeaderCell';
