import React, { type HTMLAttributes } from 'react';

import { cn } from '@/utils';

export const Container = React.memo(
  React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      return (
        <div
          className={cn('flex flex-col gap-4 h-full w-full min-h-0', className)}
          ref={ref}
          {...props}
        />
      );
    }
  )
);
