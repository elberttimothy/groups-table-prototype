import { ColumnDef } from '@tanstack/react-table';
import { SimplifyDeep } from 'type-fest';

// expected shape of type from backend API
type Aggregation<T extends string = string, V = unknown> = {
  type: T;
  value: V;
};

type Dimension<D extends string = string> = {
  dimension: D;
  aggregation: Aggregation;
};

type GroupsTableResponse = {
  dimensions: Dimension[];
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
type InferAvailableDimensions<T extends GroupsTableResponse> = T['dimensions'][number]['dimension'];

type GetDimension<T extends GroupsTableResponse, D extends InferAvailableDimensions<T>> = Extract<
  DistributeTaggedUnion<T['dimensions'][number], 'dimension'>,
  { dimension: D }
>;

type InferDimensionAggregations<
  T extends GroupsTableResponse,
  D extends InferAvailableDimensions<T>,
> = GetDimension<T, D>['aggregation']['type'];

type InferDimensionAggregationValue<
  T extends GroupsTableResponse,
  D extends InferAvailableDimensions<T>,
  A extends InferDimensionAggregations<T, D>,
> = Extract<DistributeTaggedUnion<GetDimension<T, D>['aggregation'], 'type'>, { type: A }>['value'];

type GroupsTableConfig<T extends GroupsTableResponse> = {
  dimensionColumns: {
    [K in InferAvailableDimensions<T>]: {
      [A in InferDimensionAggregations<T, K>]: ColumnDef<
        InferDimensionAggregationValue<T, K, A>,
        any
      >;
    };
  };
  metricColumns: ColumnDef<T['aggregated_metrics'], any>[];
};

type ExampleGroupsTableResponse = {
  dimensions: (
    | {
        dimension: 'product';
        aggregation:
          | {
              type: 'count' | 'product_group';
              value: string;
            }
          | {
              type: 'department_id';
              value: number;
            }
          | {
              type: 'product';
              value: {
                color: string;
                name: string;
              };
            };
      }
    | {
        dimension: 'location';
        aggregation:
          | {
              type: 'count';
              value: string;
            }
          | {
              type: 'location_id' | 'country_id' | 'location_type_id';
              value: number;
            };
      }
  )[];
  aggregated_metrics: {
    num_departments: number;
    total_sales: number;
    total_inventory: number;
  };
};

type ExampleGroupsTableConfig = GroupsTableConfig<ExampleGroupsTableResponse>;
