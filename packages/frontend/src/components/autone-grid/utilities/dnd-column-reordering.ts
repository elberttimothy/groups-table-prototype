import { type CollisionDetection, type Modifier, pointerWithin } from '@dnd-kit/core';

export const pointerWithinAccountingOverlay: CollisionDetection = (args) => {
  const { droppableContainers } = args;

  if (!args.pointerCoordinates) return [];

  const { x, y } = args.pointerCoordinates;
  const { width, height } = args.collisionRect;

  const updated = {
    ...args,
    // The collision rectangle is broken when using snapCenterToCursor. Reset
    // the collision rectangle based on pointer location and overlay size.
    collisionRect: {
      width,
      height,
      bottom: y + height / 2,
      left: x - width / 2,
      right: x + width / 2,
      top: y - height / 2,
    },
  };

  // 1) Pointer is directly over a Droppable area of the same containerId,
  // so we check precise hit-test
  return pointerWithin({
    ...updated,
    droppableContainers,
  });
};

const getActivatorCoordinates = (event: Event): { x: number; y: number } | null => {
  if ('touches' in event) {
    const touchEvent = event as TouchEvent;
    const touch = touchEvent.touches?.[0] ?? touchEvent.changedTouches?.[0];
    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  if ('clientX' in event) {
    const pointerEvent = event as MouseEvent;
    return { x: pointerEvent.clientX, y: pointerEvent.clientY };
  }

  return null;
};

/**
 * Positions the drag overlay so its *center* is always under the cursor.
 * This makes the overlay "follow the cursor" regardless of where the user grabbed.
 */
export const snapOverlayToCursorTopLeft: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  transform,
}) => {
  if (!activatorEvent || !draggingNodeRect) return transform;

  const activatorCoordinates = getActivatorCoordinates(activatorEvent);
  if (!activatorCoordinates) return transform;

  return {
    ...transform,
    x: transform.x + activatorCoordinates.x - draggingNodeRect.left,
    y: transform.y + activatorCoordinates.y - draggingNodeRect.top,
  };
};

const SEPARATOR = '$::$';

export const createDroppableId = (columnId: string, ctx: string) => {
  return `${columnId}${SEPARATOR}${ctx}`;
};

export const getColumnIdFromDroppableId = (droppableId: string) => {
  return droppableId.split(SEPARATOR)[0];
};
