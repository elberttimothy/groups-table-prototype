import { createContext, PropsWithChildren, ReactNode, useContext, useMemo } from 'react';
import { GroupsTableResponse } from '../GroupsTable.types';

type InferGroupDimensionAggregations<R extends GroupsTableResponse> = {
  [K in keyof R['dimensions']]: R['dimensions'][K]['aggregation'];
};

export interface GroupDimensionAggregationContextProviderProps<
  R extends GroupsTableResponse,
> extends PropsWithChildren {
  data: R[];
}

export interface GroupDimensionAggregationCellProps<
  R extends GroupsTableResponse,
  Dimension extends keyof R['dimensions'],
> {
  row: R;
  dimension: Dimension;
  renderAggregation: (
    aggregation: R['dimensions'][Dimension]['aggregation'],
    value: R['dimensions'][Dimension]['value']
  ) => ReactNode;
}

/**
 * Creates a context for a group table's dimension aggregations.
 *
 * This context is scoped for a single group table and strongly typed for its expected dimensions and aggregations.
 */
export const createGroupDimensionAggregationContext = <R extends GroupsTableResponse>(
  defaultAggregations: InferGroupDimensionAggregations<R>
) => {
  type GroupDimensionAggregations = InferGroupDimensionAggregations<R>;

  const EmptyDataToken = Symbol('EmptyData');
  const GroupDimensionContext = createContext<
    GroupDimensionAggregations | typeof EmptyDataToken | null
  >(null);

  /**
   * Returns the current aggregation value for a given dimension. If this cannot be inferred from the context, it will
   * return the default aggregation value.
   */
  const useGroupDimensionAggregationContext = <Dimension extends string>(dimension: Dimension) => {
    const context = useContext(GroupDimensionContext);
    if (context === null) {
      throw new Error(
        'useGroupDimensionAggregationContext must be used within a GroupDimensionContextProvider'
      );
    }
    if (context === EmptyDataToken) {
      return defaultAggregations[dimension];
    }
    return context[dimension];
  };

  /**
   * A cell component that renders the aggregation value for a given dimension.
   */
  const GroupDimensionAggregationCell = <Dimension extends string>({
    row,
    dimension,
    renderAggregation,
  }: GroupDimensionAggregationCellProps<R, Dimension>) => {
    const aggregation = useGroupDimensionAggregationContext<Dimension>(dimension);
    const aggregationValue = row.dimensions[dimension].value;
    return renderAggregation(aggregation, aggregationValue);
  };

  /**
   * Given your current data, this context will infer the current aggregation value for each dimension.
   */
  const GroupDimensionAggregationContextProvider = ({
    children,
    data,
  }: GroupDimensionAggregationContextProviderProps<R>) => {
    const firstRow = data.at(0);

    const currentAggregations = useMemo(() => {
      if (!firstRow) {
        return EmptyDataToken;
      }
      return Object.entries(firstRow.dimensions).reduce((acc, [dimension, aggregation]) => {
        acc[dimension as keyof GroupDimensionAggregations] = aggregation.aggregation;
        return acc;
      }, {} as GroupDimensionAggregations);
    }, [firstRow]);

    return (
      <GroupDimensionContext.Provider value={currentAggregations}>
        {children}
      </GroupDimensionContext.Provider>
    );
  };

  return {
    GroupDimensionAggregationContextProvider,
    GroupDimensionAggregationCell,
    useGroupDimensionAggregationContext,
  };
};
