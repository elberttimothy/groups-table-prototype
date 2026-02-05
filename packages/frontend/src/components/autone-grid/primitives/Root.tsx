import * as React from 'react';
import { useResizeObserver } from 'usehooks-ts';
import { cn } from '@/utils';
import { GridContext } from '../contexts/grid.context';
import { type GridContextValue } from '../contexts/grid.context.types';
import { cssVariables } from '../utilities/css-variables';
import { ScrollAreaRoot, ScrollAreaViewport, VerticalScrollbar, ScrollThumb, HorizontalScrollbar } from '@/atoms';

export interface GridRootPrimitiveProps {
  gridConfig: Omit<GridContextValue, 'scrollElement'>;
}

export const Root = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & GridRootPrimitiveProps
>(({ className, children, gridConfig, ...props }, ref) => {
  const { leftPinnedAreaWidth, rightPinnedAreaWidth } = gridConfig;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollRootRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);

  useResizeObserver({
    ref: rootRef,
    onResize: React.useCallback(() => {
      const rootRect = rootRef.current?.getBoundingClientRect();
      if (rootRect && scrollRootRef.current) {
        scrollRootRef.current.style.setProperty(
          cssVariables.rootHeightVar,
          `${rootRect.height}px`,
        );
        scrollRootRef.current.style.setProperty(
          cssVariables.rootWidthVar,
          `${rootRect.width}px`,
        );
      }
    }, []),
  });

  // set the header and footer heights to 0 when the root is mounted
  // each property will only then be set to the actual header and footer heights
  // when the header/footer is mounted
  React.useLayoutEffect(() => {
    if (scrollRootRef.current) {
      scrollRootRef.current.style.setProperty(
        cssVariables.headerHeightVar,
        `0px`,
      );
      scrollRootRef.current.style.setProperty(
        cssVariables.footerHeightVar,
        `0px`,
      );
    }
  }, []);

  return (
    <GridContext.Provider
      value={{ ...gridConfig, scrollElement: scrollRootRef.current }}
    >
      <ScrollAreaRoot
        type={'scroll'}
        scrollHideDelay={2500}
        ref={scrollRootRef}
        className={cn(
          'w-fit h-fit !border-none !outline-none !ring-0 !shadow-none',
          className,
        )}
      >
        <ScrollAreaViewport asChild>
          <div
            className={cn('relative overflow-auto no-scrollbar', className)}
            role="grid"
            aria-label="Data grid"
            aria-rowcount={gridConfig.table.getRowModel().rows.length}
            aria-colcount={gridConfig.table.getAllLeafColumns().length}
            ref={rootRef}
            {...props}
          >
            {children}
          </div>
        </ScrollAreaViewport>
        <VerticalScrollbar
          className="!right-[2px] z-[var(--autone-grid-scroll-z-index)]"
          style={{
            transform: `translateY(calc(var(${cssVariables.headerHeightVar}) + 2px))`,
            height: `calc(var(${cssVariables.rootHeightVar}) - var(${cssVariables.headerHeightVar}) - var(${cssVariables.footerHeightVar}) - 4px)`,
          }}
        >
          <ScrollThumb />
        </VerticalScrollbar>
        <HorizontalScrollbar
          className="!bottom-[2px] z-[var(--autone-grid-scroll-z-index)]"
          style={{
            transform: `translateX(${leftPinnedAreaWidth + 2}px) translateY(calc(-1 * var(${cssVariables.footerHeightVar}) - 2px))`,
            width: `calc(var(${cssVariables.rootWidthVar}) - ${leftPinnedAreaWidth + rightPinnedAreaWidth + 4}px)`,
          }}
        >
          <ScrollThumb />
        </HorizontalScrollbar>
      </ScrollAreaRoot>
    </GridContext.Provider>
  );
});
Root.displayName = 'Grid';
