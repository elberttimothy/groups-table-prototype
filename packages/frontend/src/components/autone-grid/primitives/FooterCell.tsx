import { motion } from 'motion/react';
import { type ComponentProps, forwardRef } from 'react';

import { cn } from '@/utils';
import { type FooterRect } from '../hooks/use-data-grid/useDataGrid.types';

export interface FooterCellProps {
  footerRect: FooterRect;
  colIndex: number;
}

export const FooterCell = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof motion.div> & FooterCellProps
>(({ children, footerRect, colIndex, className, style, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      role="gridcell"
      data-index={colIndex}
      aria-colindex={colIndex + 1}
      className={cn('absolute bg-white', className)}
      style={{
        position: footerRect.position,
        width: footerRect.width,
        height: footerRect.height,
        left: footerRect.x,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
FooterCell.displayName = 'FooterCell';
