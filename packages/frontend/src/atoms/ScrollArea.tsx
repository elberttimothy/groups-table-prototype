import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from '../utils';

export const ScrollAreaRoot = ScrollAreaPrimitive.Root;
export const ScrollAreaViewport = ScrollAreaPrimitive.Viewport;

export const VerticalScrollbar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation="vertical"
    className={cn(
      'absolute flex flex-col w-2 bg-muted-foreground/5 hover:bg-muted-foreground/10 rounded-full p-[1px] hover:p-[2px] hover:w-3 transition-all',
      className
    )}
    {...props}
  />
));
VerticalScrollbar.displayName = 'VerticalScrollbar';

export const HorizontalScrollbar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation="horizontal"
    className={cn(
      'absolute flex flex-row h-2 w-full bg-muted-foreground/5 hover:bg-muted-foreground/10 rounded-full p-[1px] hover:p-[2px] hover:h-3 transition-all',
      className
    )}
    {...props}
  />
));
HorizontalScrollbar.displayName = 'HorizontalScrollbar';

export const ScrollThumb = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Thumb
    ref={ref}
    className={cn(
      'bg-muted-foreground/30 hover:bg-muted-foreground/40 relative rounded-full hover:cursor-pointer transition-colors',
      className
    )}
    {...props}
  />
));
ScrollThumb.displayName = 'ScrollThumb';
