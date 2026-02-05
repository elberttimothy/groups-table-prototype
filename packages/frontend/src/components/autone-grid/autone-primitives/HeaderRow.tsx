import * as React from 'react';

import { cn } from '@/utils';
import { GridPrimitives } from '../primitives';

export const HeaderRow = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.HeaderRow>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.HeaderRow>
  >(({ className, ...props }, ref) => (
    <GridPrimitives.HeaderRow className={cn(className)} ref={ref} {...props} />
  )),
);
HeaderRow.displayName = 'AutoneGrid.HeaderRow';
