import { createColumnHelper } from '@tanstack/react-table';

import { createColumnLoadingGuards, type DataTableLoadingObject } from '@/utils';
import { ColumnDragHandle } from '../autone-primitives/ColumnDragHandle';

import { type VariableProduct } from './variable-content-mock-data';

const { columnCellGuard, accessorFnGuard } = createColumnLoadingGuards<VariableProduct>();
const columnHelper = createColumnHelper<VariableProduct | DataTableLoadingObject>();

export const variableColumns = [
  columnHelper.accessor(
    accessorFnGuard((row) => row.sku),
    {
      id: 'sku',
      size: 100,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>SKU</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => <span className="font-mono text-xs">{ctx.getValue()}</span>,
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.name),
    {
      id: 'name',
      size: 200,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>Product Name</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => <div className="py-2 whitespace-normal">{ctx.getValue()}</div>,
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.description),
    {
      id: 'description',
      size: 250,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>Description</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <div className="py-2 whitespace-normal text-muted-foreground text-xs leading-relaxed">
              {ctx.getValue()}
            </div>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.category),
    {
      id: 'category',
      size: 120,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>Category</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => ctx.getValue(),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.tags),
    {
      id: 'tags',
      size: 180,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>Tags</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => (
            <div className="py-2 flex flex-wrap gap-1">
              {ctx.getValue().map((tag, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          ),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.price),
    {
      id: 'price',
      size: 100,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>Price</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) =>
            ctx.getValue().toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            }),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.stock),
    {
      id: 'stock',
      size: 80,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>Stock</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => ctx.getValue().toLocaleString(),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.notes),
    {
      id: 'notes',
      size: 200,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>Notes</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => {
            const notes = ctx.getValue();
            if (!notes) return <span className="text-muted-foreground">—</span>;
            return <div className="py-2 whitespace-normal text-xs italic">{notes}</div>;
          },
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.supplier),
    {
      id: 'supplier',
      size: 160,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
          <span>Supplier</span>
        </div>
      ),
      cell: (ctx) =>
        columnCellGuard({
          ctx,
          renderCell: (ctx) => ctx.getValue(),
        }),
    }
  ),
  columnHelper.accessor(
    accessorFnGuard((row) => row.status),
    {
      id: 'status',
      size: 110,
      header: () => (
        <div className="flex items-center">
          <ColumnDragHandle className="-translate-x-1" />
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
    }
  ),
];
