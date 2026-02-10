import { deepMerge } from '@/utils';
import { useCallback, useMemo } from 'react';

export type DrilldownStack<T> = [T, ...T[]];

interface DrilldownManagerProps<T> {
  stackValue: DrilldownStack<T>;
  setStackValue: (value: DrilldownStack<T>) => void;
}

export const useDrilldownManager = <T>({ stackValue, setStackValue }: DrilldownManagerProps<T>) => {
  const push = useCallback(
    (value: T) => {
      setStackValue([...stackValue, value]);
    },
    [stackValue, setStackValue]
  );

  const pushPartial = useCallback(
    (value: Partial<T>) => {
      setStackValue([...stackValue, deepMerge(stackValue.at(-1)!, value) as T]);
    },
    [stackValue, setStackValue]
  );

  const back = useCallback(() => {
    if (stackValue.length <= 1) return;
    setStackValue(stackValue.slice(0, -1) as DrilldownStack<T>);
  }, [stackValue, setStackValue]);

  const changeTop = useCallback(
    (value: T) => {
      setStackValue([...stackValue.slice(0, -1), value] as unknown as DrilldownStack<T>);
    },
    [stackValue, setStackValue]
  );

  const changeTopPartial = useCallback(
    (value: Partial<T>) => {
      setStackValue([
        ...stackValue.slice(0, -1),
        deepMerge(stackValue.at(-1)!, value),
      ] as unknown as DrilldownStack<T>);
    },
    [stackValue, setStackValue]
  );

  const reset = useCallback(() => {
    setStackValue(stackValue);
  }, [stackValue, setStackValue]);

  const last = useMemo(() => stackValue.at(-1)!, [stackValue]);

  return useMemo(
    () => [last, { push, pushPartial, back, changeTop, changeTopPartial, reset }] as const,
    [last, push, pushPartial, back, changeTop, changeTopPartial, reset]
  );
};
