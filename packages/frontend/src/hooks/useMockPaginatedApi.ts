import { sleep } from '@/utils';
import { useCallback, useMemo, useRef, useState } from 'react';

export const useMockPaginatedApi = <Data>(
  data: Data[],
  initialPageSize: number = 10,
  delay: number = 1000,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const lastPageIndex = useRef(0);

  const canGetNextPage = useMemo(
    () => (pageIndex + 1) * pageSize < data.length,
    [pageIndex, pageSize, data.length],
  );

  const canGetPrevPage = useMemo(() => pageIndex > 0, [pageIndex]);

  const currentPage = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, pageIndex, pageSize]);

  const totalPages = useMemo(
    () => Math.ceil(data.length / pageSize),
    [data.length, pageSize],
  );

  const getNextPage = useCallback(async () => {
    if (isLoading || !canGetNextPage) return;
    if (pageIndex + 1 <= lastPageIndex.current) {
      setPageIndex((prev) => prev + 1);
      return;
    } else {
      setIsLoading(true);
      await sleep(delay);
      setPageIndex((prev) => prev + 1);
      setIsLoading(false);
      lastPageIndex.current = pageIndex + 1;
    }
  }, [delay, isLoading, pageIndex, canGetNextPage]);

  const getPrevPage = useCallback(() => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const changeLimit = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0); // Reset to first page when page size changes
  }, []);

  return {
    isLoading,
    totalPages,
    totalCount: data.length,
    currentPage,
    pagination: {
      getNextPage,
      getPrevPage,
      changeLimit,
      canGetNextPage,
      canGetPrevPage,
      pageIndex,
      pageSize,
    },
  };
};
