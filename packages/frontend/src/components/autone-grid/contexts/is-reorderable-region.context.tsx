import { createContext, type PropsWithChildren, useContext } from 'react';

const IsReorderableRegionContext = createContext<boolean | null>(null);

interface IsReorderableRegionContextProviderProps extends PropsWithChildren {
  reorderable?: boolean;
}

export const IsReorderableRegionContextProvider = ({
  children,
  reorderable,
}: IsReorderableRegionContextProviderProps) => {
  return (
    <IsReorderableRegionContext.Provider value={reorderable ?? false}>
      {children}
    </IsReorderableRegionContext.Provider>
  );
};

export const useIsReorderableRegion = () => {
  const context = useContext(IsReorderableRegionContext);
  if (context === null) {
    throw new Error(
      'useIsReorderableRegion must be used within a <IsReorderableRegionContextProvider /> component.',
    );
  }
  return context;
};
