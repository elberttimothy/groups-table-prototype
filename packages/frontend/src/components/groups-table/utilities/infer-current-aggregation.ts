import { GroupsTableResponse } from '../GroupsTable.types';

export const inferCurrentAggregation = <
  T extends GroupsTableResponse,
  Dimension extends Extract<keyof T['dimensions'], string>,
>(
  rows: T[],
  dimension: Dimension
) => {
  const row = rows.at(0);
  if (row === undefined) throw new Error('No rows provided');

  return row.dimensions[dimension].aggregation as T['dimensions'][Dimension]['aggregation'];
};
