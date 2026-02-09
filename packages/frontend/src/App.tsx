import {
  GenericAggregationResponse,
  LocationAggregation,
  ProductAggregation,
} from '@autone/backend/schemas';
import { flexRender } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import {
  ContextMenu,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './atoms';
import {
  assertNoGroupColumnDefs,
  AutoneGrid,
  AutoneGridPreset,
  useDataGrid,
} from './components/autone-grid';
import { createGroupsTableColumns } from './components/groups-table';
import { useDataTableLoadingGuard } from './hooks/use-data-table-loading-guard';
import { useGetHealthQuery, useGetSkuLocationsQuery } from './store/api';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';

function App() {
  const { data } = useGetHealthQuery();
  const [productAggregation, setProductAggregation] = useState<ProductAggregation>('product_group');
  const [locationAggregation, setLocationAggregation] =
    useState<LocationAggregation>('location_group');
  const {
    data: skuLocations,
    isLoading: isLoadingSkuLocations,
    isFetching: isFetchingSkuLocations,
  } = useGetSkuLocationsQuery({
    product_aggregation: productAggregation,
    location_aggregation: locationAggregation,
  });

  // Build columns based on the current aggregations
  const { columns, aggregationColumnIds, columnDisplayText } = useMemo(() => {
    // Default aggregations when data is not yet available
    const defaultAggregations: GenericAggregationResponse['aggregations'] = [
      { dimension: 'product', aggregation: productAggregation, value: null },
      { dimension: 'location', aggregation: locationAggregation, value: null },
    ];

    const aggregations = skuLocations?.[0]?.aggregations ?? defaultAggregations;
    return createGroupsTableColumns(aggregations);
  }, [skuLocations, productAggregation, locationAggregation]);

  // Use loading guard to manage loading states
  const { memoisedData, getRowIdLoadingGuard } = useDataTableLoadingGuard({
    mode: 'dynamic',
    isLoading: isLoadingSkuLocations,
    isFetching: isFetchingSkuLocations,
    data: skuLocations,
    initialRowCount: 10,
  });

  // Set up the data grid with left-pinned aggregation columns
  const [scrollElementRef, gridState, gridConfig] = useDataGrid({
    mode: 'fixed',
    tableOptions: {
      data: memoisedData,
      columns: assertNoGroupColumnDefs(columns),
      state: {
        columnPinning: {
          left: aggregationColumnIds,
        },
      },
      getRowId: getRowIdLoadingGuard((row: GenericAggregationResponse) => {
        // Create a unique ID from the aggregation values
        const aggregationValues = row.aggregations.map((a) => a.value ?? 'null').join('-');
        return aggregationValues;
      }),
    },
    headerHeight: 40,
    rowHeight: 52,
    overscan: {
      row: 5,
      col: 2,
    },
  });

  const virtualHeaders = gridState.getVirtualHeaders();
  const virtualRows = gridState.getVirtualRows();

  return (
    <div className="flex flex-col h-screen gap-4 p-4">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold">Health: {data?.status}</h1>
        <p className="text-sm text-muted-foreground">Database: {data?.database}</p>
      </div>
      <div className="flex flex-col items-center grow min-h-0">
        <h2 className="text-lg font-semibold mb-2">SKU Locations</h2>
        <div className="flex gap-2 mb-4">
          <Select
            value={productAggregation}
            onValueChange={(value) => setProductAggregation(value as ProductAggregation)}
          >
            <SelectTrigger aria-label="Product Aggregation" id="product-aggregation">
              <SelectValue placeholder="Select Product Aggregation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sku_id">SKU ID</SelectItem>
              <SelectItem value="product_id">Product ID</SelectItem>
              <SelectItem value="department_id">Department ID</SelectItem>
              <SelectItem value="sub_department_id">Sub Department ID</SelectItem>
              <SelectItem value="style_id">Style ID</SelectItem>
              <SelectItem value="season_id">Season ID</SelectItem>
              <SelectItem value="gender_id">Gender ID</SelectItem>
              <SelectItem value="product_group">Product Group</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={locationAggregation}
            onValueChange={(value) => setLocationAggregation(value as LocationAggregation)}
          >
            <SelectTrigger aria-label="Location Aggregation" id="location-aggregation">
              <SelectValue placeholder="Select Location Aggregation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="location_id">Location ID</SelectItem>
              <SelectItem value="country_id">Country ID</SelectItem>
              <SelectItem value="location_type_id">Location Type ID</SelectItem>
              <SelectItem value="region_id">Region ID</SelectItem>
              <SelectItem value="location_group">Location Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AutoneGridPreset.Root
          className="w-[80vw] h-[60vh] bg-white border rounded-md"
          gridConfig={gridConfig}
          ref={scrollElementRef}
        >
          <AutoneGridPreset.Header virtualHeaders={virtualHeaders}>
            {({ header, headerRect }) => (
              <AutoneGrid.HeaderCell
                columnId={header.column.id}
                colIndex={header.column.getIndex()}
                headerRect={headerRect}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </AutoneGrid.HeaderCell>
            )}
          </AutoneGridPreset.Header>
          <AutoneGridPreset.Body>
            {virtualRows.map((virtualRow) => (
              <AutoneGridPreset.Row key={virtualRow.key} virtualRow={virtualRow}>
                {({ cell, cellRect, index }) => (
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <AutoneGridPreset.Cell
                        columnId={cell.column.id}
                        colIndex={index}
                        rowIndex={virtualRow.index}
                        cellRect={cellRect}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </AutoneGridPreset.Cell>
                    </ContextMenuTrigger>
                  </ContextMenu>
                )}
              </AutoneGridPreset.Row>
            ))}
          </AutoneGridPreset.Body>
          <AutoneGridPreset.ColumnDragOverlay columnDisplayText={columnDisplayText} />
        </AutoneGridPreset.Root>
      </div>
    </div>
  );
}

export default App;
