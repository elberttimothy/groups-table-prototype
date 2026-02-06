import { DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { MoveIcon } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';

import { snapOverlayToCursorTopLeft } from '../utilities/dnd-column-reordering';

export interface ColumnDragOverlayProps<ColumnIds extends string = string> {
  columnDisplayText: Record<ColumnIds, React.ReactNode>;
}

const _ColumnDragOverlay = React.memo<ColumnDragOverlayProps>(({ columnDisplayText }) => {
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setActiveItemId(event.active.id.toString());
    },
    onDragEnd: () => {
      setActiveItemId(null);
    },
  });

  return createPortal(
    <DragOverlay
      dropAnimation={null}
      modifiers={[snapOverlayToCursorTopLeft]}
      className="relative"
      style={{
        width: 'fit-content',
        height: 'fit-content',
      }}
    >
      {activeItemId && (
        <>
          <div className="absolute top-0 left-0 -translate-x-[50%] -translate-y-[50%] size-10 cursor-grabbing" />
          <div className="border flex flex-row items-center gap-2 bg-accent p-2 rounded-md shadow-lg text-sm cursor-grabbing">
            <MoveIcon className="size-4 text-accent-foreground" />
            {columnDisplayText[activeItemId]}
          </div>
        </>
      )}
    </DragOverlay>,
    document.body
  );
});

export const ColumnDragOverlay = _ColumnDragOverlay as <ColumnIds extends string = string>(
  props: ColumnDragOverlayProps<ColumnIds>
) => React.ReactNode;
