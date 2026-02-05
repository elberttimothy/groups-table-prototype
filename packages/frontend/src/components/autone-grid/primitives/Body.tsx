import * as React from 'react';

import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';
import { cssVariables } from '../utilities/css-variables';

export const Body = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { rowWidth, rowVirtualiser } = useGridContext();

  return (
    <div
      ref={ref}
      role="rowgroup"
      className={cn('flex flex-col', className)}
      style={{
        width: rowWidth,
        minHeight: `calc(var(${cssVariables.rootHeightVar}) - var(${cssVariables.headerHeightVar}) - var(${cssVariables.footerHeightVar}))`,
        height: rowVirtualiser.getTotalSize(),
      }}
      {...props}
    />
  );
});
Body.displayName = 'Body';
