import { Draft, produce } from 'immer';
import { useCallback, useMemo } from 'react';

export interface StackManagerProps<T> {
  stack: T[];
  onStackChange: (stack: T[]) => void;
}

export const useStackManager = <T>({ stack, onStackChange }: StackManagerProps<T>) => {
  /**
   * Push a new value to the top of the stack.
   */
  const push = useCallback(
    (value: T) => {
      onStackChange([...stack, value]);
    },
    [stack, onStackChange]
  );

  /**
   * Pop the top of the stack.
   */
  const pop = useCallback(() => {
    if (stack.length === 0) return;
    onStackChange(stack.slice(0, -1));
  }, [stack, onStackChange]);

  /**
   * Update the top of the stack and push the new value to the top of the stack.
   */
  const updatePush = useCallback(
    (recipe: (prev: Draft<T>) => void) => {
      const stackTop = stack.at(-1);
      if (!stackTop) return;
      const newStackTop = produce(stackTop, recipe);
      onStackChange([...stack, newStackTop]);
    },
    [stack, onStackChange]
  );

  /**
   * Immutably update the value on top of the stack.
   */
  const updateTop = useCallback(
    (recipe: (prev: Draft<T>) => void) => {
      const stackTop = stack.at(-1);
      if (!stackTop) return;
      const newStackTop = produce(stackTop, recipe);
      onStackChange([...stack.slice(0, -1), newStackTop]);
    },
    [stack, onStackChange]
  );

  /**
   * Immutably update the value of an item in the stack.
   */
  const updateItem = useCallback(
    (index: number, recipe: (prev: Draft<T>) => void) => {
      const item = stack.at(index);
      if (!item) return;
      const newItem = produce(item, recipe);
      onStackChange([...stack.slice(0, index), newItem, ...stack.slice(index + 1)]);
    },
    [stack, onStackChange]
  );

  /**
   * Clear the stack.
   */
  const clear = useCallback(() => {
    onStackChange([]);
  }, [onStackChange]);

  return useMemo(
    () => [stack, { push, pop, updatePush, updateTop, updateItem, clear }] as const,
    [stack, push, pop, updatePush, updateTop, updateItem, clear]
  );
};
