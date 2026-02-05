import * as React from 'react';

import { cn } from '@/utils';
import { GridPrimitives } from '../primitives';

export const Footer = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.Footer>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.Footer>
  >(({ className, ...props }, ref) => (
    <GridPrimitives.Footer
      className={cn(
        'bg-accent',
        'z-[var(--autone-grid-footer-z-index)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  )),
);
Footer.displayName = 'AutoneGrid.Footer';
