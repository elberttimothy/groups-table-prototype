import { type useDraggable } from '@dnd-kit/core';
import { createContext, type PropsWithChildren, useContext } from 'react';

type DraggableReturnType = ReturnType<typeof useDraggable>;

const ColumnDragHandleContext = createContext<DraggableReturnType | null>(null);

export const ColumnDragHandleContextProvider = ({
  children,
  draggable,
}: PropsWithChildren<{ draggable: DraggableReturnType }>) => {
  return (
    <ColumnDragHandleContext.Provider value={draggable}>
      {children}
    </ColumnDragHandleContext.Provider>
  );
};

export const useColumnDragHandle = () => {
  const context = useContext(ColumnDragHandleContext);
  if (!context) {
    throw new Error(
      'useColumnDragHandle must be used within a ColumnDragHandleContextProvider',
    );
  }
  return context;
};
