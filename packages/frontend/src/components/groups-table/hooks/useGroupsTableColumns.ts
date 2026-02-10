import { useMemo } from 'react';
import {
  GroupsTableConfig,
  GroupsTableResponse,
  InferAvailableDimensions,
  InferDimensionAggregations,
} from '../GroupsTable.types';

interface UseGroupsTableColumnsProps<R extends GroupsTableResponse> {
  data: R[];
  config: GroupsTableConfig<R>;
}

const isDimensionInConfig = <R extends GroupsTableResponse>(
  dimension: string,
  config: GroupsTableConfig<R>
): dimension is InferAvailableDimensions<R> => {
  return dimension in config.dimensionColumns;
};

const isAggregationInDimension = <R extends GroupsTableResponse>(
  aggregation: string,
  configDimension: GroupsTableConfig<R>['dimensionColumns'][InferAvailableDimensions<R>]
): aggregation is InferDimensionAggregations<R, InferAvailableDimensions<R>> => {
  return aggregation in configDimension;
};

export const useGroupsTableColumns = <R extends GroupsTableResponse>({
  data,
  config,
}: UseGroupsTableColumnsProps<R>) => {
  const dimensionColumns = useMemo(() => {
    const firstRow = data[0];
    return firstRow.dimensions.map((dim) => {
      if (
        isDimensionInConfig(dim.dimension, config) &&
        isAggregationInDimension(dim.aggregation.type, config.dimensionColumns[dim.dimension])
      ) {
        return config.dimensionColumns[dim.dimension][dim.aggregation.type];
      }

      throw new Error(
        `Unhandled dimension ${dim.dimension} with aggregation ${dim.aggregation.type} in config`
      );
    });
  }, [data, config]);

  return useMemo(
    () => [...dimensionColumns, ...config.metricColumns],
    [dimensionColumns, config.metricColumns]
  );
};
