import {
  GenericAggregationResponse,
  LocationAggregation,
  ProductAggregation,
  SkuLocationBody,
} from '@autone/backend/schemas';
import { flexRender } from '@tanstack/react-table';
import { useState } from 'react';

import { Button, ContextMenu } from './atoms';
import {
  assertNoGroupColumnDefs,
  AutoneGrid,
  AutoneGridPreset,
  useDataGrid,
} from './components/autone-grid';
import {
  groupsTableColumns,
  dimensionColumnIds,
  columnDisplayText,
} from './components/groups-table';
import { useDataTableLoadingGuard } from './hooks/use-data-table-loading-guard';
import { useGetHealthQuery, useGetSkuLocationsQuery } from './store/api';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { ChevronLeftIcon } from 'lucide-react';
import { useStackManager } from './components/groups-table/hooks/useStackManager';
import { StackContextProvider } from './components/groups-table/GroupsTable.context';

export interface GroupsTableParameters {
  productAggregation: ProductAggregation;
  locationAggregation: LocationAggregation;
  filter: NonNullable<Required<SkuLocationBody['filters']>>;
}

function App() {
  const { data } = useGetHealthQuery();
  const [drilldownStack, setDrilldownStack] = useState<GroupsTableParameters[]>([
    {
      productAggregation: 'product_group',
      locationAggregation: 'location_group',
      filter: {
        product: {},
        location: {},
      },
    },
  ]);

  const stackManager = useStackManager({
    stack: drilldownStack,
    onStackChange: setDrilldownStack,
  });

  const [stack, { pop }] = stackManager;
  const current = stack.at(-1)!;

  const {
    data: skuLocations,
    isLoading: isLoadingSkuLocations,
    isFetching: isFetchingSkuLocations,
  } = useGetSkuLocationsQuery({
    product_aggregation: current.productAggregation,
    location_aggregation: current.locationAggregation,
    filters: current.filter,
  });

  // Use loading guard to manage loading states
  const { memoisedData, getRowIdLoadingGuard } = useDataTableLoadingGuard({
    mode: 'dynamic',
    isLoading: isLoadingSkuLocations,
    isFetching: isFetchingSkuLocations,
    data: skuLocations,
    initialRowCount: 10,
  });

  // Set up the data grid with left-pinned dimension columns
  const [scrollElementRef, gridState, gridConfig] = useDataGrid({
    mode: 'fixed',
    tableOptions: {
      data: memoisedData,
      columns: assertNoGroupColumnDefs(groupsTableColumns),
      state: {
        columnPinning: {
          left: dimensionColumnIds,
        },
      },
      getRowId: getRowIdLoadingGuard((row: GenericAggregationResponse) => {
        // Create a unique ID from the dimension values
        const productValue = row.dimensions.product.value ?? 'null';
        const locationValue = row.dimensions.location.value ?? 'null';
        return `${productValue}-${locationValue}`;
      }),
    },
    headerHeight: 64,
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
        <div className="flex flex-row gap-6 w-fit">
          <StackContextProvider stackManager={stackManager}>
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
          </StackContextProvider>
          <div className="flex flex-col gap-4 w-[200px]">
            <span>Filters</span>
            <pre className="text-xs">{JSON.stringify(current.filter, null, 2)}</pre>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            disabled={drilldownStack.length <= 1}
            onClick={() => {
              pop();
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
