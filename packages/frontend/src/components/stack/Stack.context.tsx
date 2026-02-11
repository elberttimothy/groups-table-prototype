import { createContext, PropsWithChildren, useCallback, useContext } from 'react';

type StackContextValue<T = any> = [
  T[],
  {
    push: (value: T) => void;
    pop: () => void;
    peek: () => T | undefined;
    clear: () => void;
  },
];

const StackContext = createContext<StackContextValue | null>(null);

interface StackContextProviderProps<T = any> extends PropsWithChildren {
  stack: T[];
  onStackChange: (stack: T[]) => void;
}

export const StackContextProvider = <T,>({
  children,
  stack,
  onStackChange,
}: StackContextProviderProps<T>) => {
  const push = useCallback(
    (value: T) => {
      onStackChange([...stack, value]);
    },
    [stack, onStackChange]
  );

  const pop = useCallback(() => {
    onStackChange(stack.slice(0, -1));
  }, [stack, onStackChange]);

  const peek = useCallback(() => {
    return stack.at(-1);
  }, [stack]);

  const clear = useCallback(() => {
    onStackChange([]);
  }, [onStackChange]);

  return (
    <StackContext.Provider value={[stack, { push, pop, peek, clear }]}>
      {children}
    </StackContext.Provider>
  );
};

export const useStackContext = <T,>() => {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error('useStack must be used within a <StackContextProvider />');
  }
  return context as StackContextValue<T>;
};
