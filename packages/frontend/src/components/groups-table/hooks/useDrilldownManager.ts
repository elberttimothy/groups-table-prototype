import { StackManagerProps, useStackManager } from '@/components/stack/hooks/useStackManager';
import { Draft } from 'immer';
import { useCallback, useMemo } from 'react';

export interface GroupsTableDrilldownState {
  /**
   * A record of available dimensions and their current aggregations on the stack.
   */
  dimension_aggregations: Record<string, string>;
  /**
   * A record of available filters and their current values on the stack.
   */
  filters: Record<string, unknown[]>;
}

export const useDrilldownManager = <State extends GroupsTableDrilldownState>({
  stack,
  onStackChange,
}: StackManagerProps<State>) => {
  type DimensionsRecord = State['dimension_aggregations'];
  type Dimensions = Extract<keyof DimensionsRecord, string>;
  type FiltersRecord = State['filters'];
  type DrilldownFilters = {
    [Dim in Dimensions]: {
      [Aggregation in Extract<
        keyof FiltersRecord,
        DimensionsRecord[Dim]
      >]?: FiltersRecord[Aggregation];
    };
  };

  const [drilldownStack, { updateTop, pop, push }] = useStackManager({
    stack,
    onStackChange,
  });

  const stackTop = drilldownStack.at(-1);

  if (!stackTop)
    throw new Error('Drilldown stack is empty. You need to enforce a non-empty stack.');

  /**
   * Drilldown to a new dimension and aggregation. You must provide a new filter for each dimension.
   */
  const drilldownTo = useCallback(
    <Dimension extends Dimensions, Aggregation extends DimensionsRecord[Dimension]>(
      dimension: Dimension,
      aggregation: Aggregation,
      drilldownFilters: DrilldownFilters
    ) => {
      // validate that a filter is applied to each dimension
      const drilldownDimensionFilters = Object.entries(drilldownFilters) as [string, unknown][];
      if (
        drilldownDimensionFilters.every(
          ([_, filters]) => typeof filters === 'object' && filters !== null
        )
      ) {
        for (const [dimension, filters] of drilldownDimensionFilters) {
          if (Object.keys(filters as object).length === 0) {
            throw new Error(
              `You did not specify a filter for the ${dimension} dimension. Drilldown filters must not be empty.`
            );
          }
        }
      } else {
        throw new Error('Drilldown filters must be an object.');
      }

      const newFilters = Object.values(drilldownFilters) as Record<string, unknown>[];
      const newFiltersMerged = newFilters
        .flatMap((newFilter) => Object.entries(newFilter))
        .reduce(
          (acc, [agg, value]) => ({
            ...acc,
            [agg]: value as unknown[],
          }),
          {} as Record<string, unknown[]>
        );

      push({
        dimension_aggregations: {
          ...stackTop.dimension_aggregations,
          [dimension]: aggregation,
        },
        filters: newFiltersMerged,
      } as State);
    },
    [stackTop, push]
  );

  /**
   * Pop the top of the drilldown stack. Will enforce a non-empty stack.
   */
  const popDrilldown = useCallback(() => {
    if (drilldownStack.length === 0) {
      throw new Error('Drilldown stack is empty. You need to enforce a non-empty stack.');
    }
    if (drilldownStack.length === 1) return;
    pop();
  }, [drilldownStack, pop]);

  /**
   * Get the merged filters for a given drilldown index. Will merge the filters for the entire stack by default.
   */
  const getMergedFilters = useCallback(
    (drilldownIdx?: number) => {
      if (drilldownIdx !== undefined) {
        if (drilldownIdx < 0) {
          throw new Error('Drilldown index must be greater than 0.');
        }
        if (drilldownIdx > drilldownStack.length - 1) {
          throw new Error('Drilldown index must be less than the stack length.');
        }
      }

      // default merge the entire stack
      const sliceToMerge =
        drilldownIdx === undefined ? drilldownStack : drilldownStack.slice(0, drilldownIdx + 1);

      const mergedFilters: Record<string, unknown[]> = {};
      for (const stackItem of sliceToMerge) {
        const { filters } = stackItem;
        for (const [agg, value] of Object.entries(filters)) {
          if (agg in mergedFilters) {
            mergedFilters[agg].push(...value);
          } else {
            mergedFilters[agg] = [...value];
          }
        }
      }
      return mergedFilters as FiltersRecord;
    },
    [drilldownStack]
  );

  /**
   * Change the current (top of the stack) dimension aggregation.
   */
  const changeCurrentDimensionAggregation = useCallback(
    <Dimension extends Dimensions, Aggregation extends DimensionsRecord[Dimension]>(
      dimension: Dimension,
      aggregation: Aggregation
    ) => {
      updateTop((draft) => {
        draft.dimension_aggregations[dimension] = aggregation;
      });
    },
    [updateTop]
  );

  /**
   * Change the current (top of the stack) filters.
   */
  const changeCurrentFilters = useCallback(
    (recipe: (draft: Draft<FiltersRecord>) => void) => {
      updateTop((draft) => {
        recipe(draft.filters as Draft<FiltersRecord>);
      });
    },
    [updateTop]
  );

  return useMemo(
    () => ({
      stack: drilldownStack,
      stackTop,
      drilldownTo,
      updateTop,
      getMergedFilters,
      popDrilldown,
      changeCurrentDimensionAggregation,
      changeCurrentFilters,
    }),
    [
      drilldownStack,
      stackTop,
      drilldownTo,
      updateTop,
      getMergedFilters,
      popDrilldown,
      changeCurrentDimensionAggregation,
      changeCurrentFilters,
    ]
  );
};
