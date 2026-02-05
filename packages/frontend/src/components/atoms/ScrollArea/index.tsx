import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from '@/utils';

export const ScrollAreaRoot = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Root>
));
ScrollAreaRoot.displayName = 'ScrollAreaRoot';

export const ScrollAreaViewport = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn('h-full w-full rounded-[inherit]', className)}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Viewport>
));
ScrollAreaViewport.displayName = 'ScrollAreaViewport';

export const VerticalScrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation="vertical"
    className={cn(
      'flex touch-none select-none transition-colors',
      'h-full w-2.5 border-l border-l-transparent p-[1px]',
      className,
    )}
    {...props}
  />
));
VerticalScrollbar.displayName = 'VerticalScrollbar';

export const HorizontalScrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation="horizontal"
    className={cn(
      'flex touch-none select-none transition-colors',
      'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  />
));
HorizontalScrollbar.displayName = 'HorizontalScrollbar';

export const ScrollThumb = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Thumb
    ref={ref}
    className={cn('relative flex-1 rounded-full bg-border', className)}
    {...props}
  />
));
ScrollThumb.displayName = 'ScrollThumb';

export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaRoot ref={ref} className={className} {...props}>
    <ScrollAreaViewport>{children}</ScrollAreaViewport>
    <VerticalScrollbar>
      <ScrollThumb />
    </VerticalScrollbar>
    <HorizontalScrollbar>
      <ScrollThumb />
    </HorizontalScrollbar>
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaRoot>
));
ScrollArea.displayName = 'ScrollArea';

