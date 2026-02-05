import * as React from 'react';

import { cn } from '@/utils';
import { useGridContext } from '../contexts/grid.context';
import { GridPrimitives } from '../primitives';
import { cssVariables } from '../utilities/css-variables';

import {
  CenterBodyGroup,
  LeftBodyGroup,
  RightBodyGroup,
} from './PinningGroups';
import { DynamicRow, Row } from './Row';

export const Body = React.memo(
  React.forwardRef<
    React.ElementRef<typeof GridPrimitives.Body>,
    React.ComponentPropsWithoutRef<typeof GridPrimitives.Body>
  >(({ className, children, ...props }, ref) => {
    return (
      <GridPrimitives.Body
        className={cn(
          'no-scrollbar',
          'z-[var(--autone-grid-body-z-index)]',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
        <DummyRow />
      </GridPrimitives.Body>
    );
  }),
);
Body.displayName = 'AutoneGrid.Body';

/**
 * This is a dummy row that is used to fill the space of the grid when total row height is less than the height of the grid.
 */
const DummyRow = () => {
  const { mode, rowVirtualiser, leftPinnedAreaWidth, rightPinnedAreaWidth } =
    useGridContext();
  const lastVirtualRow = rowVirtualiser.getVirtualItems().at(-1);
  const lastVirtualRowTop = lastVirtualRow?.start ?? 0;
  const lastVirtualRowHeight = lastVirtualRow?.size ?? 0;
  const totalRowHeight = lastVirtualRowTop + lastVirtualRowHeight;
  const transform = `translateY(${totalRowHeight}px)`;
  const height = `calc(var(${cssVariables.rootHeightVar}) - var(${cssVariables.headerHeightVar}) - var(${cssVariables.footerHeightVar}) - ${totalRowHeight}px)`;

  if (mode === 'dynamic') {
    return (
      <DynamicRow
        rowIndex={rowVirtualiser.getVirtualItems().length}
        className="border-none"
        rowRect={{
          height,
          position: 'absolute',
          y: totalRowHeight,
        }}
        style={{ height, transform }}
      >
        <RowContent
          leftPinnedAreaWidth={leftPinnedAreaWidth}
          rightPinnedAreaWidth={rightPinnedAreaWidth}
        />
      </DynamicRow>
    );
  }

  return (
    <Row
      rowIndex={rowVirtualiser.getVirtualItems().length}
      className="border-none"
      rowRect={{
        position: 'absolute',
        height,
        y: totalRowHeight,
      }}
    >
      <RowContent
        leftPinnedAreaWidth={leftPinnedAreaWidth}
        rightPinnedAreaWidth={rightPinnedAreaWidth}
      />
    </Row>
  );
};

const RowContent = ({
  leftPinnedAreaWidth,
  rightPinnedAreaWidth,
}: {
  leftPinnedAreaWidth: number;
  rightPinnedAreaWidth: number;
}) => (
  <>
    <LeftBodyGroup className="h-full" style={{ width: leftPinnedAreaWidth }} />
    <CenterBodyGroup className="h-full" />
    <RightBodyGroup
      className="h-full"
      style={{ width: rightPinnedAreaWidth }}
    />
  </>
);
