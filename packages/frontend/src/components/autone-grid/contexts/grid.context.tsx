import { createContext, useContext } from 'react';

import { type GridContextValue } from './grid.context.types';

export const GridContext = createContext<GridContextValue | null>(null);

export const useGridContext = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error(
      'useGridContext must be used within a `<Grid.Root />` component.',
    );
  }
  return context;
};
