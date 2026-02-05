import { createColumnHelper } from '@tanstack/react-table';

import {
  createColumnLoadingGuards,
  type DataTableLoadingObject,
} from '../../table';
import { ColumnDragHandle } from '../autone-primitives/ColumnDragHandle';

import { type Product } from './mock-data';

const { columnCellGuard, accessorFnGuard, columnHeaderGuard } =
  createColumnLoadingGuards<Product>();
const columnHelper = createColumnHelper<Product | DataTableLoadingObject>();

export const columns = [
  columnHelper.accessor(
    accessorFnGuard((row) => row.sku),
    {
      id: 'sku',
      size: 100,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span>SKU</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="font-mono text-xs">{ctx.getValue()}</span>
          ),
        }),
      footer: () => (
        <span className="text-xs font-medium text-muted-foreground">Total</span>
      ),
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.name),
    {
      id: 'name',
      size: 220,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span>Product Name</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => ctx.getValue(),
        }),
      footer: () => <span className="text-xs text-muted-foreground">—</span>,
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.category),
    {
      id: 'category',
      size: 140,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span>Category</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => ctx.getValue(),
        }),
      footer: () => <span className="text-xs text-muted-foreground">—</span>,
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.price),
    {
      id: 'price',
      size: 125,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Price</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue().toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </span>
          ),
        }),
      footer: (ctx) =>
        columnHeaderGuard({
          ctx,
          renderCell: (ctx) => {
            const total = ctx.table
              .getFilteredRowModel()
              .rows.reduce(
                (sum, row) => sum + row.getValue<number>('price'),
                0,
              );
            return (
              <span className="block w-full text-right text-xs font-medium">
                {total.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </span>
            );
          },
        }),
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.stock),
    {
      id: 'stock',
      size: 125,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Stock</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">
              {ctx.getValue().toLocaleString()}
            </span>
          ),
        }),
      footer: (ctx) =>
        columnHeaderGuard({
          ctx,
          renderCell: (ctx) => {
            const total = ctx.table
              .getFilteredRowModel()
              .rows.reduce(
                (sum, row) => sum + row.getValue<number>('stock'),
                0,
              );
            return (
              <span className="block w-full text-right text-xs font-medium">
                {total.toLocaleString()}
              </span>
            );
          },
        }),
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.status),
    {
      id: 'status',
      size: 110,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span>Status</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => {
            const status = ctx.getValue();
            return (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium">
                {status.replace('_', ' ')}
              </span>
            );
          },
        }),
      footer: () => <span className="text-xs text-muted-foreground">—</span>,
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.supplier),
    {
      id: 'supplier',
      size: 180,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span>Supplier</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => ctx.getValue(),
        }),
      footer: () => <span className="text-xs text-muted-foreground">—</span>,
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.warehouse),
    {
      id: 'warehouse',
      size: 140,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span>Warehouse</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => ctx.getValue(),
        }),
      footer: () => <span className="text-xs text-muted-foreground">—</span>,
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.weight),
    {
      id: 'weight',
      size: 125,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Weight</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">{ctx.getValue()} kg</span>
          ),
        }),
      footer: (ctx) =>
        columnHeaderGuard({
          ctx,
          renderCell: (ctx) => {
            const total = ctx.table
              .getFilteredRowModel()
              .rows.reduce(
                (sum, row) => sum + row.getValue<number>('weight'),
                0,
              );
            return (
              <span className="block w-full text-right text-xs font-medium">
                {total.toFixed(2)} kg
              </span>
            );
          },
        }),
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.rating),
    {
      id: 'rating',
      size: 125,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span className="flex-1 text-right">Rating</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <span className="block w-full text-right">{ctx.getValue()} ★</span>
          ),
        }),
      footer: (ctx) =>
        columnHeaderGuard({
          ctx,
          renderCell: (ctx) => {
            const total = ctx.table
              .getFilteredRowModel()
              .rows.reduce(
                (sum, row) => sum + row.getValue<number>('rating'),
                0,
              );
            return (
              <span className="block w-full text-right text-xs font-medium">
                {total.toFixed(1)} ★
              </span>
            );
          },
        }),
    },
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.lastUpdated),
    {
      id: 'lastUpdated',
      size: 120,
      header: () => (
        <div className="flex items-center gap-2">
          <ColumnDragHandle />
          <span>Last Updated</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) =>
            ctx.getValue().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
        }),
      footer: () => <span className="text-xs text-muted-foreground">—</span>,
    },
  ),
];
