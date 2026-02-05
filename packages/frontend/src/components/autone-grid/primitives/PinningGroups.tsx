import { forwardRef } from 'react';

import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';

export const LeftPinnedGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-label="Pinned columns (left)"
      className={cn(
        'sticky flex flex-row left-0 top-0 shrink-0 w-fit self-stretch',
        className,
      )}
      {...props}
    />
  );
});
LeftPinnedGroup.displayName = 'LeftPinnedGroup';

export const RightPinnedGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-label="Pinned columns (right)"
      className={cn(
        'sticky flex flex-row right-0 top-0 shrink-0 w-fit self-stretch',
        className,
      )}
      {...props}
    />
  );
});
RightPinnedGroup.displayName = 'RightPinnedGroup';

export const CenterGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const { columnVirtualiser } = useGridContext();

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Scrollable columns"
      className={cn('relative flex flex-row w-full self-stretch', className)}
      style={{
        width: columnVirtualiser.getTotalSize(),
        ...style,
      }}
      {...props}
    />
  );
});
CenterGroup.displayName = 'CenterGroup';
