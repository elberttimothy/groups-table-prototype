import * as React from 'react';

import { cn } from '@/utils';
import { GridPrimitives } from '../primitives';

export const Header = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.Header>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.Header>
  >(({ className, ...props }, ref) => (
    <GridPrimitives.Header
      className={cn(
        'bg-secondary shadow-sm',
        'z-[var(--autone-grid-header-z-index)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  )),
);
Header.displayName = 'AutoneGrid.Header';
