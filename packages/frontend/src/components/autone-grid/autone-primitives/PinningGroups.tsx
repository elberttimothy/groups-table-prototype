import * as React from 'react';

import { cn } from '@/utils';
import { IsReorderableRegionContextProvider } from '../contexts/is-reorderable-region.context';
import { GridPrimitives } from '../primitives';

// ========================= HEADER GROUPS =========================

export const LeftHeaderGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.LeftPinnedGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.LeftPinnedGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.LeftPinnedGroup
      className={cn(
        'z-[var(--autone-grid-header-pinned-left-z-index)] shadow-left-col flex flex-row items-start bg-secondary',
        className
      )}
      ref={ref}
      {...props}
    >
      <IsReorderableRegionContextProvider reorderable={false}>
        {children}
      </IsReorderableRegionContextProvider>
    </GridPrimitives.LeftPinnedGroup>
  ))
);
LeftHeaderGroup.displayName = 'AutoneGrid.LeftHeaderGroup';

export const CenterHeaderGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.CenterGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.CenterGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.CenterGroup
      className={cn(
        'z-[var(--autone-grid-header-pinned-center-z-index)] relative w-full flex flex-row bg-secondary',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </GridPrimitives.CenterGroup>
  ))
);
CenterHeaderGroup.displayName = 'AutoneGrid.CenterHeaderGroup';

export const RightHeaderGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.RightPinnedGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.RightPinnedGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.RightPinnedGroup
      className={cn(
        'z-[var(--autone-grid-header-pinned-right-z-index)] shadow-right-col flex flex-row bg-secondary',
        className
      )}
      ref={ref}
      {...props}
    >
      <IsReorderableRegionContextProvider reorderable={false}>
        {children}
      </IsReorderableRegionContextProvider>
    </GridPrimitives.RightPinnedGroup>
  ))
);
RightHeaderGroup.displayName = 'AutoneGrid.RightHeaderGroup';

// ========================= BODY GROUPS =========================

export const LeftBodyGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.LeftPinnedGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.LeftPinnedGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.LeftPinnedGroup
      className={cn(
        'z-[var(--autone-grid-body-pinned-left-z-index)] shadow-left-col bg-white',
        className
      )}
      ref={ref}
      {...props}
    >
      <IsReorderableRegionContextProvider reorderable={false}>
        {children}
      </IsReorderableRegionContextProvider>
    </GridPrimitives.LeftPinnedGroup>
  ))
);
LeftBodyGroup.displayName = 'AutoneGrid.LeftBodyGroup';

export const CenterBodyGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.CenterGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.CenterGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.CenterGroup
      className={cn(
        'z-[var(--autone-grid-body-pinned-center-z-index)] flex bg-white group-hover:bg-secondary transition-colors',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </GridPrimitives.CenterGroup>
  ))
);
CenterBodyGroup.displayName = 'AutoneGrid.CenterBodyGroup';

export const RightBodyGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.RightPinnedGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.RightPinnedGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.RightPinnedGroup
      className={cn(
        'z-[var(--autone-grid-body-pinned-right-z-index)] shadow-right-col bg-white',
        className
      )}
      ref={ref}
      {...props}
    >
      <IsReorderableRegionContextProvider reorderable={false}>
        {children}
      </IsReorderableRegionContextProvider>
    </GridPrimitives.RightPinnedGroup>
  ))
);
RightBodyGroup.displayName = 'AutoneGrid.RightBodyGroup';

// ========================= FOOTER GROUPS =========================

export const LeftFooterGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.LeftPinnedGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.LeftPinnedGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.LeftPinnedGroup
      className={cn(
        'z-[var(--autone-grid-footer-pinned-left-z-index)] shadow-left-col flex flex-row bg-secondary',
        className
      )}
      ref={ref}
      {...props}
    >
      <IsReorderableRegionContextProvider reorderable={false}>
        {children}
      </IsReorderableRegionContextProvider>
    </GridPrimitives.LeftPinnedGroup>
  ))
);
LeftFooterGroup.displayName = 'AutoneGrid.LeftFooterGroup';

export const CenterFooterGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.CenterGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.CenterGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.CenterGroup
      className={cn(
        'z-[var(--autone-grid-footer-pinned-center-z-index)] relative w-full flex flex-row bg-secondary',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </GridPrimitives.CenterGroup>
  ))
);
CenterFooterGroup.displayName = 'AutoneGrid.CenterFooterGroup';

export const RightFooterGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.RightPinnedGroup>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.RightPinnedGroup>
  >(({ className, children, ...props }, ref) => (
    <GridPrimitives.RightPinnedGroup
      className={cn(
        'z-[var(--autone-grid-footer-pinned-right-z-index)] shadow-right-col flex flex-row bg-secondary',
        className
      )}
      ref={ref}
      {...props}
    >
      <IsReorderableRegionContextProvider reorderable={false}>
        {children}
      </IsReorderableRegionContextProvider>
    </GridPrimitives.RightPinnedGroup>
  ))
);
RightFooterGroup.displayName = 'AutoneGrid.RightFooterGroup';
