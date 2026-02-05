import { forwardRef } from 'react';

import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';
import { cssVariables } from '../utilities/css-variables';

export const FooterRow = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, style, ...props }, ref) => {
  const { footerHeight } = useGridContext();

  return (
    <div
      ref={ref}
      role="row"
      className={cn('relative flex flex-row', className)}
      style={{
        minWidth: `var(${cssVariables.rootWidthVar})`,
        minHeight: footerHeight,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
FooterRow.displayName = 'FooterRow';
