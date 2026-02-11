import { ColumnDef } from '@tanstack/react-table';
import { SimplifyDeep } from 'type-fest';

// expected shape of type from backend API
export type Aggregation<T extends string = string, V = unknown> = {
  // tag
  aggregation: T;
  value: V;
};

export type GroupsTableResponse = {
  dimensions: Record<string, Aggregation>;
  aggregated_metrics: Record<string, unknown>;
};

/**
 * Utility to properly distribute collapsed tagged unions into their individual variants,
 *
 * @example
 * type TaggedUnion = | {
 *   type: 'count' | 'product_group';
 *   value: string;
 * }
 * | {
 *   type: 'department_id';
 *   value: number;
 * };
 *
 * type DistributedTaggedUnion = DistributeTaggedUnion<TaggedUnion, 'type'>;
 *
 * // DistributedTaggedUnion will be:
 * // {
 * //   type: 'count';
 * //   value: string;
 * // } | {
 * //   type: 'product_group';
 * //   value: string;
 * // } | {
 * //   type: 'department_id';
 * //   value: number;
 * // }
 */
type DistributeTaggedUnion<U, Tag extends keyof U> = U[Tag] extends infer Variant
  ? Variant extends unknown
    ? SimplifyDeep<
        { [T in Tag]: Variant } & (U extends unknown
          ? Variant extends U[Tag]
            ? Omit<U, Tag>
            : never
          : never)
      >
    : never
  : never;

// generic helpers to infer the available dimensions and aggregations from the response
export type InferAvailableDimensions<T extends GroupsTableResponse> = keyof T['dimensions'];

export type InferDimensionAggregations<
  T extends GroupsTableResponse,
  D extends InferAvailableDimensions<T>,
> = T['dimensions'][D]['aggregation'];

type InferDimensionAggregationValue<
  T extends GroupsTableResponse,
  D extends InferAvailableDimensions<T>,
  A extends InferDimensionAggregations<T, D>,
> = Extract<DistributeTaggedUnion<T['dimensions'][D], 'aggregation'>, { aggregation: A }>['value'];

/**
 * Generic type to infer the configuration for the GroupsTable component based on the response from the backend API.
 *
 * This enforces that all possible dimensions and aggregations are handled by the table.
 */
export type GroupsTableDimensionConfig<T extends GroupsTableResponse> = {
  [K in InferAvailableDimensions<T>]: {
    [A in InferDimensionAggregations<T, K>]: ColumnDef<
      InferDimensionAggregationValue<T, K, A>,
      any
    >;
  };
};
