import { useCallback } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { LoadingIcon } from '../../../icons';
import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';
import { cssVariables } from '../utilities/css-variables';

export interface InfiniteScrollSentinelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  isLoading?: boolean;
  isFetching?: boolean;
  canGetNextPage?: boolean;
  onSentinelEnter?: () => void;
  onSentinelLeave?: () => void;
}

export const InfiniteScrollSentinel = ({
  isLoading,
  isFetching,
  canGetNextPage,
  onSentinelEnter,
  onSentinelLeave,
  className,
  ...props
}: InfiniteScrollSentinelProps) => {
  const { scrollElement, footerHeight } = useGridContext();

  const [sentinelRef] = useIntersectionObserver({
    root: scrollElement,
    threshold: 0,
    rootMargin: `${footerHeight}px`,
    onChange: useCallback(
      (isIntersecting: boolean) => {
        if (isIntersecting) {
          onSentinelEnter?.();
        } else {
          onSentinelLeave?.();
        }
      },
      [onSentinelEnter, onSentinelLeave],
    ),
  });

  if (isLoading || !canGetNextPage) return null;

  return (
    <div
      ref={sentinelRef}
      className={cn(
        'sticky left-0 w-full h-12 flex flex-col items-center justify-center',
        'bg-accent animate-pulse',
        className,
      )}
      style={{ width: `var(${cssVariables.rootWidthVar})` }}
      {...props}
    >
      {isFetching && <LoadingIcon className="animate-spin" />}
    </div>
  );
};
