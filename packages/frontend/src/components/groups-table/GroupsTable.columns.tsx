import { GenericAggregationResponse } from '@autone/backend/schemas';
import { createColumnHelper } from '@tanstack/react-table';

import { ColumnDragHandle } from '@/components/autone-grid';
import { createColumnLoadingGuards, type DataTableLoadingObject } from '@/utils';

type AggregationColumns = GenericAggregationResponse['aggregations'];

const { columnCellGuard, accessorFnGuard } =
  createColumnLoadingGuards<GenericAggregationResponse>();
const columnHelper = createColumnHelper<GenericAggregationResponse | DataTableLoadingObject>();

/**
 * Creates an aggregation column that displays the dimension value.
 * The column id includes the aggregation type to ensure uniqueness (e.g., 'product-product_group').
 */
const createAggregationColumn = (aggregation: AggregationColumns[number]) => {
  return columnHelper.accessor(
    accessorFnGuard((row) => row.aggregations.find((a) => a.dimension === aggregation.dimension)),
    {
      id: `${aggregation.dimension}-${aggregation.aggregation}`,
      size: 150,
      header: () => (
        <div className="flex items-center gap-2">
          <span className="capitalize">{aggregation.aggregation.replace(/_/g, ' ')}</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => <span>{ctx.getValue()?.value ?? '-'}</span>,
        }),
    }
  );
};

const metricColumns = [
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.sales_l30d),
    {
      id: 'sales_l30d',
      size: 170,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Sales L30D</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.sales_l60d),
    {
      id: 'sales_l60d',
      size: 170,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Sales L60D</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.sales_l90d),
    {
      id: 'sales_l90d',
      size: 170,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Sales L90D</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.inventory),
    {
      id: 'inventory',
      size: 170,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Inventory</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.pending_from_production),
    {
      id: 'pending_from_production',
      size: 230,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Pending from Production</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.recommended_ia),
    {
      id: 'recommended_ia',
      size: 190,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Recommended IA</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.unconstrained_ia),
    {
      id: 'unconstrained_ia',
      size: 190,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Unconstrained IA</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.user_ia),
    {
      id: 'user_ia',
      size: 150,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right">User IA</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.num_sku_locations),
    {
      id: 'num_sku_locations',
      size: 180,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># SKU Locations</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.num_assorted_sku_locations),
    {
      id: 'num_assorted_sku_locations',
      size: 220,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># Assorted SKU Locations</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.num_recommend_assort_sku_locations),
    {
      id: 'num_recommend_assort_sku_locations',
      size: 270,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># Recommend Assort SKU Locations</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue()?.toLocaleString() ?? '-'}
            </span>
          ),
        }),
    }
  ),
];

/**
 * Static column display text mapping for metric columns.
 * Used by ColumnDragOverlay to show the column name when dragging.
 */
const metricColumnDisplayText: Record<string, string> = {
  sales_l30d: 'Sales L30D',
  sales_l60d: 'Sales L60D',
  sales_l90d: 'Sales L90D',
  inventory: 'Inventory',
  pending_from_production: 'Pending from Production',
  recommended_ia: 'Recommended IA',
  unconstrained_ia: 'Unconstrained IA',
  user_ia: 'User IA',
  num_sku_locations: '# SKU Locations',
  num_assorted_sku_locations: '# Assorted SKU Locations',
  num_recommend_assort_sku_locations: '# Recommend Assort SKU Locations',
};

/**
 * Creates the columns for the groups table, with aggregation columns followed by metric columns.
 * Returns the column IDs for the aggregation columns to be used for left pinning.
 */
export const createGroupsTableColumns = (aggregations: AggregationColumns) => {
  const aggregationColumns = aggregations.map(createAggregationColumn);
  const aggregationColumnIds = aggregations.map((a) => `${a.dimension}-${a.aggregation}`);

  // Build display text mapping including dynamic aggregation columns
  const aggregationColumnDisplayText = aggregations.reduce(
    (acc, a) => {
      const columnId = `${a.dimension}-${a.aggregation}`;
      // Format the aggregation name nicely (e.g., 'product_group' -> 'Product Group')
      acc[columnId] = a.aggregation
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return acc;
    },
    {} as Record<string, string>
  );

  const columnDisplayText = {
    ...aggregationColumnDisplayText,
    ...metricColumnDisplayText,
  };

  return {
    columns: [...aggregationColumns, ...metricColumns],
    aggregationColumnIds,
    columnDisplayText,
  };
};
