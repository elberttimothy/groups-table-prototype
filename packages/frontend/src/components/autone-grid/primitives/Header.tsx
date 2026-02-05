import * as React from 'react';
import { useLayoutEffect } from 'react';

import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';
import { cssVariables } from '../utilities/css-variables';

export const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => headerRef.current as HTMLDivElement, []);

  const { headerHeight, scrollElement } = useGridContext();

  // if mounted, set the header height on the scrollElement to position vertical scrollbar
  useLayoutEffect(() => {
    if (scrollElement) {
      scrollElement.style.setProperty(
        cssVariables.headerHeightVar,
        `${headerHeight}px`,
      );
    }
  }, [headerHeight, scrollElement]);

  return (
    <div
      className={cn('flex flex-row min-w-full sticky top-0', className)}
      ref={headerRef}
      style={{
        minWidth: `var(${cssVariables.rootWidthVar})`,
        minHeight: headerHeight,
        ...style,
      }}
      role="rowgroup"
      {...props}
    />
  );
});

Header.displayName = 'Header';
