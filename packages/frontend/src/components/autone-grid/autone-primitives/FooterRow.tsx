import * as React from 'react';

import { GridPrimitives } from '../primitives';

export const FooterRow = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.FooterRow>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.FooterRow>
  >(({ className, ...props }, ref) => (
    <GridPrimitives.FooterRow className={className} ref={ref} {...props} />
  )),
);
FooterRow.displayName = 'AutoneGrid.FooterRow';
