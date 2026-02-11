import { createContext } from 'react';
import { useContext } from 'react';
import { useStackManager } from './hooks/useStackManager';

type StackManager<T> = ReturnType<typeof useStackManager<T>>;

const StackContext = createContext<StackManager<unknown> | null>(null);

interface StackContextProviderProps<T> {
  children: React.ReactNode;
  stackManager: StackManager<T>;
}

export const StackContextProvider = <T,>({
  children,
  stackManager,
}: StackContextProviderProps<T>) => {
  return (
    <StackContext.Provider value={stackManager as StackManager<unknown>}>
      {children}
    </StackContext.Provider>
  );
};

export const useStackContext = <T,>() => {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error('useStackContext must be used within a StackContextProvider');
  }
  return context as StackManager<T>;
};
