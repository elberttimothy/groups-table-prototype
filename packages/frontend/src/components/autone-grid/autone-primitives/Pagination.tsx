import { useAutoneTranslation } from '@autone/translations';
import { fNumberWithCommas } from '@autone/utils';
import React, { useRef } from 'react';

import { Button, Skeleton } from '../../../atoms';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../icons';

export interface PaginationProps {
  getNextPage: () => void;
  getPrevPage: () => void;
  canGetPrevPage: boolean;
  canGetNextPage: boolean;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  loading?: boolean;
}

export const Pagination = React.memo(
  ({
    getNextPage,
    getPrevPage,
    canGetPrevPage,
    canGetNextPage,
    pageIndex,
    pageSize,
    totalRows,
    loading,
  }: PaginationProps) => {
    const { common } = useAutoneTranslation();
    const lastValidTotalRows = useRef(0);

    if (totalRows) {
      lastValidTotalRows.current = totalRows;
    }

    const totalRowsCount = lastValidTotalRows.current;
    const totalPages = Math.ceil(totalRowsCount / pageSize);
    const totalRecordsLabel = `${fNumberWithCommas(totalRowsCount)} ${common('pagination.rows')}`;
    const pageRangeLabel = `${pageIndex + 1} ${common('pagination.of')} ${totalPages}`;

    if (loading) {
      return (
        <div className="flex items-center justify-between">
          <Skeleton className="w-20 h-6" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-6" />
            <Skeleton className="w-8 h-6" />
            <Skeleton className="w-8 h-6" />
          </div>
        </div>
      );
    }

    return (
      <div
        id="data-table-pagination"
        aria-label="Data table pagination controls"
        className="flex items-center w-full"
      >
        <p className="capitalize">{totalRecordsLabel}</p>
        <div className="flex items-center gap-8 ml-auto">
          <span>{pageRangeLabel}</span>
          <div className="flex items-center gap-2">
            <Button
              id="data-table-pagination-previous-page"
              aria-label="Previous page"
              variant="ghost"
              size="icon-sm"
              disabled={!canGetPrevPage}
              onClick={getPrevPage}
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              id="data-table-pagination-next-page"
              aria-label="Next page"
              variant="ghost"
              size="icon-sm"
              disabled={!canGetNextPage}
              onClick={getNextPage}
            >
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
