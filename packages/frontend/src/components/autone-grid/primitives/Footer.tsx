import * as React from 'react';
import { useLayoutEffect } from 'react';

import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';
import { cssVariables } from '../utilities/css-variables';

export const Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const footerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => footerRef.current as HTMLDivElement, []);

  const { footerHeight, scrollElement } = useGridContext();

  // if mounted, set the footer height on the scrollElement to position vertical scrollbar
  useLayoutEffect(() => {
    if (scrollElement) {
      scrollElement.style.setProperty(
        cssVariables.footerHeightVar,
        `${footerHeight}px`,
      );
    }
  }, [footerHeight, scrollElement]);

  return (
    <div
      ref={footerRef}
      role="rowgroup"
      className={cn(
        'flex flex-row min-w-full sticky -bottom-[0.5px]',
        className,
      )}
      style={{
        minWidth: `var(${cssVariables.rootWidthVar})`,
        minHeight: footerHeight,
        ...style,
      }}
      {...props}
    />
  );
});
Footer.displayName = 'Footer';
