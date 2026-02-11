import { ReactNode } from 'react';
import { GroupsTableResponse } from '../GroupsTable.types';

export interface GroupDimensionAggregationCellProps<
  R extends GroupsTableResponse,
  Dimension extends Extract<keyof R['dimensions'], string>,
> {
  row: R;
  dimension: Dimension;
  renderAggregation: (aggregation: R['dimensions'][Dimension]) => ReactNode;
}

/**
 * A cell component that renders the aggregation value for a given dimension.
 */
export const GroupDimensionAggregationCell = <
  R extends GroupsTableResponse,
  Dimension extends Extract<keyof R['dimensions'], string>,
>({
  row,
  dimension,
  renderAggregation,
}: GroupDimensionAggregationCellProps<R, Dimension>) => {
  const rowDimension = row.dimensions[dimension];
  return renderAggregation(rowDimension as R['dimensions'][Dimension]);
};
