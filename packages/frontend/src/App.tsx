import {
  SkuLocationResponse,
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
import { useGetSkuLocationsQuery } from './store/api';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { ChevronLeftIcon } from 'lucide-react';
import {
  GroupsTableContextProvider,
  useGroupsTableContext,
} from './components/groups-table/GroupsTable.context';
import {
  GroupsTableDrilldownState,
  useDrilldownManager,
} from './components/groups-table/hooks/useDrilldownManager';

export interface GroupsTableParameters extends GroupsTableDrilldownState {
  dimension_aggregations: {
    product: ProductAggregation;
    location: LocationAggregation;
  };
  filters: NonNullable<SkuLocationBody['filters']>;
}

function App() {
  const [drilldownStack, setDrilldownStack] = useState<GroupsTableParameters[]>([
    {
      dimension_aggregations: {
        product: 'product_group',
        location: 'location_group',
      },
      filters: {},
    },
  ]);

  const drilldownManager = useDrilldownManager({
    stack: drilldownStack,
    onStackChange: setDrilldownStack,
  });

  const { stack } = drilldownManager;

  return (
    <div className="flex flex-col h-screen gap-4 p-4">
      <div className="flex flex-col gap-4 items-center grow min-h-0">
        <h2 className="text-lg font-semibold mb-2">SKU Locations</h2>
        <div className="flex flex-row gap-6 w-fit">
          <GroupsTableContextProvider drilldownManager={drilldownManager}>
            <GroupsTable />
          </GroupsTableContextProvider>
          <pre className="text-xs">{JSON.stringify(drilldownManager.stack, null, 2)}</pre>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            disabled={stack.length <= 1}
            onClick={() => {
              drilldownManager.popDrilldown();
            }}
            aria-label="Previous Filters"
            id="previous-filters"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex flex-col gap-2">
            <pre className="text-xs">
              {JSON.stringify(stack.map((s) => s.dimension_aggregations.product))}
            </pre>
            <pre className="text-xs">
              {JSON.stringify(stack.map((s) => s.dimension_aggregations.location))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

const GroupsTable = () => {
  const { stackTop, getMergedFilters } = useGroupsTableContext<GroupsTableParameters>();

  const {
    data: skuLocations,
    isLoading: isLoadingSkuLocations,
    isFetching: isFetchingSkuLocations,
    refetch,
  } = useGetSkuLocationsQuery({
    dimension_aggregations: {
      product: stackTop.dimension_aggregations.product,
      location: stackTop.dimension_aggregations.location,
    },
    filters: getMergedFilters(),
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
      getRowId: getRowIdLoadingGuard((row: SkuLocationResponse) => {
        // Create a unique ID from the dimension values
        const productValue = row.dimensions.product.value ?? 'null';
        const locationValue = row.dimensions.location.value ?? 'null';
        return `${productValue}-${locationValue}`;
      }),
    },
    headerHeight: 64,
    rowHeight: 52,
    overscan: {
      row: 0,
      col: 0,
    },
  });

  const virtualHeaders = gridState.getVirtualHeaders();
  const virtualRows = gridState.getVirtualRows();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Button className="w-fit" onClick={() => refetch()} aria-label="Refetch" id="refetch">
          Refetch
        </Button>
        <div>Count: {skuLocations?.length}</div>
      </div>
      <AutoneGridPreset.Root
        style={{ width: '60vw' }}
        className="h-[60vh] bg-white border rounded-md shadow-md overflow-auto"
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
  );
};
