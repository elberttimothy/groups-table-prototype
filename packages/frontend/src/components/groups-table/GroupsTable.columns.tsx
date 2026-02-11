import { GenericAggregationResponse } from '@autone/backend/schemas';
import { createColumnHelper } from '@tanstack/react-table';

import { ColumnDragHandle } from '@/components/autone-grid';
import { createColumnLoadingGuards, type DataTableLoadingObject } from '@/utils';
import { DrilldownContextMenu } from './components/DrilldownContextMenu';
import { DimensionHeaderCell } from './components/GroupDimensionAggregationHeaderCell';
import { useDrilldownContext } from './GroupsTable.context';
import { GroupsTableParameters } from '@/App';
import { GroupDimensionAggregationCell } from './components/GroupDimensionAggregationCell';

const { columnCellGuard, accessorFnGuard } =
  createColumnLoadingGuards<GenericAggregationResponse>();
const columnHelper = createColumnHelper<GenericAggregationResponse | DataTableLoadingObject>();

// Product dimension column
const productDimensionColumn = columnHelper.accessor(
  accessorFnGuard((row) => row.dimensions.product),
  {
    id: 'product',
    size: 180,
    header: function ProductDimensionHeader() {
      return <DimensionHeaderCell dimension="product" defaultAggregation="product_group" />;
    },
    cell: (ctx) =>
      columnCellGuard({
        ctx,
        renderCell: function ProductDimensionCell(ctx) {
          const row = ctx.row.original;
          const [_, { pushPartial }] = useDrilldownContext<GroupsTableParameters>();

          return (
            <>
              <span>{aggregation.value ?? '-'}</span>
              <DrilldownContextMenu
                dimension="product"
                onDrilldown={(arg) => {
                  if (arg.dimension === 'product') {
                    pushPartial({
                      productAggregation: arg.aggregation,
                      filter: {
                        product: {
                          [row.dimensions.product.aggregation]: [row.dimensions.product.value],
                        },
                        location: {
                          [row.dimensions.location.aggregation]: [row.dimensions.location.value],
                        },
                      },
                    });
                  }
                }}
              />
            </>
          );
        },
      }),
  }
);

// Location dimension column
const locationDimensionColumn = columnHelper.accessor(
  accessorFnGuard((row) => row.dimensions.location),
  {
    id: 'location',
    size: 180,
    header: function LocationDimensionHeader() {
      return <DimensionHeaderCell dimension="location" defaultAggregation={'location_group'} />;
    },
    cell: (ctx) =>
      columnCellGuard({
        ctx,
        renderCell: function LocationDimensionCell(ctx) {
          const row = ctx.row.original;
          const [_, { pushPartial }] = useDrilldownContext<GroupsTableParameters>();

          return (
            <GroupDimensionAggregationCell
              row={row}
              dimension="location"
              renderAggregation={(aggregation) => (
                <>
                  <span>{value ?? '-'}</span>
                  <DrilldownContextMenu
                    dimension="location"
                    onDrilldown={(arg) => {
                      if (arg.dimension === 'location') {
                        pushPartial({
                          locationAggregation: arg.aggregation,
                          filter: {
                            product: {
                              [row.dimensions.product.aggregation]: [row.dimensions.product.value],
                            },
                            location: {
                              [row.dimensions.location.aggregation]: [
                                row.dimensions.location.value,
                              ],
                            },
                          },
                        });
                      }
                    }}
                  />
                </>
              )}
            />
          );
        },
      }),
  }
);

const dimensionColumns = [productDimensionColumn, locationDimensionColumn];
const dimensionColumnIds = ['product', 'location'];

const attributeColumns = [
  columnHelper.accessor(
    accessorFnGuard((row) => row.aggregated_metrics.num_departments),
    {
      id: 'num_departments',
      size: 170,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># Departments</span>
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
    accessorFnGuard((row) => row.aggregated_metrics.num_sub_departments),
    {
      id: 'num_sub_departments',
      size: 190,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># Sub Departments</span>
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
    accessorFnGuard((row) => row.aggregated_metrics.num_styles),
    {
      id: 'num_styles',
      size: 150,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># Styles</span>
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
    accessorFnGuard((row) => row.aggregated_metrics.num_seasons),
    {
      id: 'num_seasons',
      size: 150,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># Seasons</span>
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
    accessorFnGuard((row) => row.aggregated_metrics.num_genders),
    {
      id: 'num_genders',
      size: 150,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># Genders</span>
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
    accessorFnGuard((row) => row.aggregated_metrics.num_products),
    {
      id: 'num_products',
      size: 150,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># Products</span>
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
    accessorFnGuard((row) => row.aggregated_metrics.num_skus),
    {
      id: 'num_skus',
      size: 150,
      header: () => (
        <div className="flex items-center gap-2 justify-between">
          <ColumnDragHandle />
          <span className="flex-1 text-right"># SKUs</span>
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
 * Static column display text mapping for attribute columns.
 * Used by ColumnDragOverlay to show the column name when dragging.
 */
const attributeColumnDisplayText: Record<string, string> = {
  num_departments: '# Departments',
  num_sub_departments: '# Sub Departments',
  num_styles: '# Styles',
  num_seasons: '# Seasons',
  num_genders: '# Genders',
  num_products: '# Products',
  num_skus: '# SKUs',
};

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
 * Static column display text mapping for dimension columns.
 */
const dimensionColumnDisplayText: Record<string, string> = {
  product: 'Product',
  location: 'Location',
};

/**
 * Combined column display text for all columns.
 */
export const columnDisplayText = {
  ...dimensionColumnDisplayText,
  ...attributeColumnDisplayText,
  ...metricColumnDisplayText,
};

/**
 * All columns for the groups table.
 */
export const groupsTableColumns = [...dimensionColumns, ...attributeColumns, ...metricColumns];

/**
 * Column IDs for the dimension columns (used for left pinning).
 */
export { dimensionColumnIds };
