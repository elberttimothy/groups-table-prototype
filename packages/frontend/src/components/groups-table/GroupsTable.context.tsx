import { createContext } from 'react';
import { useContext } from 'react';
import { useDrilldownManager } from './hooks/useDrilldownManager';

type DrilldownManager<T> = ReturnType<typeof useDrilldownManager<T>>;

const DrilldownContext = createContext<DrilldownManager<unknown> | null>(null);

interface DrilldownContextProviderProps<T> {
  children: React.ReactNode;
  drilldownManager: DrilldownManager<T>;
}

export const DrilldownContextProvider = <T,>({
  children,
  drilldownManager,
}: DrilldownContextProviderProps<T>) => {
  return (
    <DrilldownContext.Provider value={drilldownManager as DrilldownManager<unknown>}>
      {children}
    </DrilldownContext.Provider>
  );
};

export const useDrilldownContext = <T,>() => {
  const context = useContext(DrilldownContext);
  if (!context) {
    throw new Error('useDrilldownContext must be used within a DrilldownContextProvider');
  }
  return context as DrilldownManager<T>;
};
