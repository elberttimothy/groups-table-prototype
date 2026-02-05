import { forwardRef } from 'react';

import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';
import { cssVariables } from '../utilities/css-variables';

export const HeaderRow = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, style, ...props }, ref) => {
  const { headerHeight } = useGridContext();

  return (
    <div
      ref={ref}
      role="row"
      className={cn('flex flex-row', className)}
      style={{
        minWidth: `var(${cssVariables.rootWidthVar})`,
        minHeight: headerHeight,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
HeaderRow.displayName = 'HeaderRow';
