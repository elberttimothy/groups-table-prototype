import {
  GenericAggregationResponse,
  ProductAggregation,
  LocationAggregation,
} from '@autone/backend/schemas';
import { createColumnHelper } from '@tanstack/react-table';

import { ColumnDragHandle } from '@/components/autone-grid';
import { createColumnLoadingGuards, type DataTableLoadingObject } from '@/utils';
import { DrilldownContextMenu } from './components/DrilldownContextMenu';
import { GroupsTableParameters } from '@/App';
import { GroupDimensionAggregationCell } from './components/GroupDimensionAggregationCell';
import { useStackContext } from './GroupsTable.context';
import { inferCurrentAggregation } from './utilities/infer-current-aggregation';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/atoms';

const { columnCellGuard, columnHeaderGuard, accessorFnGuard } =
  createColumnLoadingGuards<GenericAggregationResponse>();
const columnHelper = createColumnHelper<GenericAggregationResponse | DataTableLoadingObject>();

const productAggregationOptions: { value: ProductAggregation; label: string }[] = [
  { value: 'sku_id', label: 'SKU ID' },
  { value: 'product_id', label: 'Product ID' },
  { value: 'department_id', label: 'Department ID' },
  { value: 'sub_department_id', label: 'Sub Department ID' },
  { value: 'style_id', label: 'Style ID' },
  { value: 'season_id', label: 'Season ID' },
  { value: 'gender_id', label: 'Gender ID' },
  { value: 'product_group', label: 'Product Group' },
];

const locationAggregationOptions: { value: LocationAggregation; label: string }[] = [
  { value: 'location_id', label: 'Location ID' },
  { value: 'country_id', label: 'Country ID' },
  { value: 'location_type_id', label: 'Location Type ID' },
  { value: 'region_id', label: 'Region ID' },
  { value: 'location_group', label: 'Location Group' },
];

// Product dimension column
const productDimensionColumn = columnHelper.accessor(
  accessorFnGuard((row) => row.dimensions.product),
  {
    id: 'product',
    size: 180,
    header: (ctx) =>
      columnHeaderGuard({
        ctx,
        renderCell: function ProductDimensionHeader({ table }) {
          const [_, { updateTop }] = useStackContext<GroupsTableParameters>();

          const rows = table.getRowModel().rows.map((row) => row.original);
          const aggregation = inferCurrentAggregation(rows, 'product');

          const handleValueChange = (value: typeof aggregation) => {
            updateTop((draft) => {
              draft.productAggregation = value;
            });
          };

          return (
            <Select value={aggregation} onValueChange={handleValueChange}>
              <SelectTrigger
                aria-label={'Product Aggregation'}
                id={'product-aggregation'}
                className="shadow-none hover:bg-muted/50 focus:ring-0 capitalize"
              >
                <SelectValue placeholder={'Select Product Aggregation'} />
              </SelectTrigger>
              <SelectContent>
                {productAggregationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
        renderLoader: function ProductDimensionHeaderLoader() {
          const [stack] = useStackContext<GroupsTableParameters>();
          const current = stack.at(-1);
          if (!current) return null;
          return (
            <span>
              {productAggregationOptions.find(
                (option) => option.value === current.productAggregation
              )?.label ?? '-'}
            </span>
          );
        },
      }),
    cell: (ctx) =>
      columnCellGuard({
        ctx,
        renderCell: function ProductDimensionCell(ctx) {
          const row = ctx.row.original;
          const [_, { updatePush }] = useStackContext<GroupsTableParameters>();

          return (
            <>
              <span>{row.dimensions.product.value ?? '-'}</span>
              <DrilldownContextMenu
                dimension="product"
                onDrilldown={(arg) => {
                  if (arg.dimension === 'product') {
                    updatePush((draft) => {
                      draft.productAggregation = arg.aggregation;

                      if (draft.filter.product) {
                        const productFilter =
                          draft.filter.product[row.dimensions.product.aggregation];
                        if (productFilter) {
                          productFilter.push(row.dimensions.product.value);
                        } else {
                          draft.filter.product[row.dimensions.product.aggregation] = [
                            row.dimensions.product.value,
                          ];
                        }
                      }

                      if (draft.filter.location) {
                        const locationFilter =
                          draft.filter.location[row.dimensions.location.aggregation];
                        if (locationFilter) {
                          locationFilter.push(row.dimensions.location.value);
                        } else {
                          draft.filter.location[row.dimensions.location.aggregation] = [
                            row.dimensions.location.value,
                          ];
                        }
                      }
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
    header: (ctx) =>
      columnHeaderGuard({
        ctx,
        renderCell: function LocationDimensionHeader({ table }) {
          const [_, { updateTop }] = useStackContext<GroupsTableParameters>();

          const rows = table.getRowModel().rows.map((row) => row.original);
          const aggregation = inferCurrentAggregation(rows, 'location');

          const handleValueChange = (value: typeof aggregation) => {
            updateTop((draft) => {
              draft.locationAggregation = value;
            });
          };
          return (
            <Select value={aggregation} onValueChange={handleValueChange}>
              <SelectTrigger
                aria-label={'Location Aggregation'}
                id={'location-aggregation'}
                className="shadow-none hover:bg-muted/50 focus:ring-0 capitalize"
              >
                <SelectValue placeholder={'Select Location Aggregation'} />
              </SelectTrigger>
              <SelectContent>
                {locationAggregationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
        renderLoader: function LocationDimensionHeaderLoader() {
          const [stack] = useStackContext<GroupsTableParameters>();
          const current = stack.at(-1);
          if (!current) return null;
          return (
            <span>
              {locationAggregationOptions.find(
                (option) => option.value === current.locationAggregation
              )?.label ?? '-'}
            </span>
          );
        },
      }),
    cell: (ctx) =>
      columnCellGuard({
        ctx,
        renderCell: function LocationDimensionCell(ctx) {
          const row = ctx.row.original;
          const [_, { updatePush }] = useStackContext<GroupsTableParameters>();
          return (
            <GroupDimensionAggregationCell
              row={row}
              dimension="location"
              renderAggregation={(aggregation) => (
                <>
                  <span>{row.dimensions.location.value ?? '-'}</span>
                  <DrilldownContextMenu
                    dimension="location"
                    onDrilldown={(arg) => {
                      if (arg.dimension === 'location') {
                        updatePush((draft) => {
                          draft.locationAggregation = arg.aggregation;

                          if (draft.filter.product) {
                            const productFilter =
                              draft.filter.product[row.dimensions.product.aggregation];
                            if (productFilter) {
                              productFilter.push(row.dimensions.product.value);
                            } else {
                              draft.filter.product[row.dimensions.product.aggregation] = [
                                row.dimensions.product.value,
                              ];
                            }
                          }

                          if (draft.filter.location) {
                            const locationFilter =
                              draft.filter.location[row.dimensions.location.aggregation];
                            if (locationFilter) {
                              locationFilter.push(row.dimensions.location.value);
                            } else {
                              draft.filter.location[row.dimensions.location.aggregation] = [
                                row.dimensions.location.value,
                              ];
                            }
                          }
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
