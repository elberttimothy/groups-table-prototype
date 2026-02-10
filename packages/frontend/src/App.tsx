import {
  GenericAggregationResponse,
  LocationAggregation,
  ProductAggregation,
  SkuLocationBody,
} from '@autone/backend/schemas';
import { flexRender } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import {
  Button,
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
import { DrilldownContextProvider } from './components/groups-table/GroupsTable.context';
import { ChevronLeftIcon } from 'lucide-react';
import {
  DrilldownStack,
  useDrilldownManager,
} from './components/groups-table/hooks/useDrilldownManager';
import { deepMerge } from './utils';

export interface GroupsTableParameters {
  productAggregation: ProductAggregation;
  locationAggregation: LocationAggregation;
  filter: SkuLocationBody['filters'];
}

function App() {
  const { data } = useGetHealthQuery();
  const [drilldownStack, setDrilldownStack] = useState<DrilldownStack<GroupsTableParameters>>([
    {
      productAggregation: 'product_group',
      locationAggregation: 'location_group',
      filter: {},
    },
  ]);

  const drilldownManager = useDrilldownManager({
    stackValue: drilldownStack,
    setStackValue: setDrilldownStack,
  });

  const [current, { back, changeTopPartial }] = drilldownManager;

  const mergedFilters = useMemo(() => {
    const filters = drilldownStack
      .map((stack) => stack.filter)
      .reduce(
        (acc, curr) => {
          return deepMerge(acc, curr);
        },
        {} as SkuLocationBody['filters']
      );
    return filters;
  }, [drilldownStack]);

  const {
    data: skuLocations,
    isLoading: isLoadingSkuLocations,
    isFetching: isFetchingSkuLocations,
  } = useGetSkuLocationsQuery({
    product_aggregation: current.productAggregation,
    location_aggregation: current.locationAggregation,
    filters: mergedFilters,
  });

  // Build columns based on the current aggregations
  const { columns, aggregationColumnIds, columnDisplayText } = useMemo(() => {
    // Default aggregations when data is not yet available
    const defaultAggregations: GenericAggregationResponse['aggregations'] = [
      { dimension: 'product', aggregation: current.productAggregation, value: null },
      { dimension: 'location', aggregation: current.locationAggregation, value: null },
    ];

    const aggregations = skuLocations?.[0]?.aggregations ?? defaultAggregations;
    return createGroupsTableColumns(aggregations);
  }, [skuLocations, current]);

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
      <div className="flex flex-col gap-4 items-center grow min-h-0">
        <h2 className="text-lg font-semibold mb-2">SKU Locations</h2>
        <div className="flex gap-2 mb-4">
          <Select
            value={current.productAggregation}
            onValueChange={(value) =>
              changeTopPartial({ productAggregation: value as ProductAggregation })
            }
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
            value={current.locationAggregation}
            onValueChange={(value) =>
              changeTopPartial({ locationAggregation: value as LocationAggregation })
            }
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
        <div className="flex flex-row gap-6 w-fit">
          <DrilldownContextProvider drilldownManager={drilldownManager}>
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
          </DrilldownContextProvider>
          <div className="flex flex-col gap-4 w-[200px]">
            <span>Filters</span>
            <pre className="text-xs">{JSON.stringify(current.filter, null, 2)}</pre>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            disabled={drilldownStack.length <= 1}
            onClick={() => {
              back();
            }}
            aria-label="Previous Filters"
            id="previous-filters"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex flex-col gap-2">
            <pre className="text-xs">
              {JSON.stringify(drilldownStack.map((stack) => stack.productAggregation))}
            </pre>
            <pre className="text-xs">
              {JSON.stringify(drilldownStack.map((stack) => stack.locationAggregation))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
