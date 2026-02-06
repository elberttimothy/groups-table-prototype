import {
  createContext,
  type MutableRefObject,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react';

const HighlightedRowContext = createContext<MutableRefObject<number | null>>({
  current: null,
});

export const useHighlightedRow = () => {
  const context = useContext(HighlightedRowContext);
  if (!context) {
    throw new Error('useHighlightedRow must be used within a HighlightedRowContext');
  }
  return context;
};

export const HighlightedRowContextProvider = ({ children }: PropsWithChildren) => {
  const highlightedRowIdxRef = useRef<number | null>(null);
  return (
    <HighlightedRowContext.Provider value={highlightedRowIdxRef}>
      {children}
    </HighlightedRowContext.Provider>
  );
};
