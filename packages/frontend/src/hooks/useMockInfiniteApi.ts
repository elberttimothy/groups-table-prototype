import { sleep } from '@/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useMockInfiniteApi = <Data>(
  data: Data[],
  pageSize: number = 10,
  delay: number = 1000
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState<Data[][]>([]);

  // initial load
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setPages(pageSize > data.length ? [data] : [data.slice(0, pageSize)]);
    }, delay);
  }, [delay, data, pageSize]);

  const canLoadNextPage = useMemo(
    () => pages.length * pageSize < data.length,
    [pages.length, pageSize, data.length]
  );

  const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize]);

  const loadNextPage = useCallback(async () => {
    if (isLoading || !canLoadNextPage) return;

    setIsLoading(true);
    await sleep(delay);
    setPages((prev) => [...prev, data.slice(prev.length * pageSize, (prev.length + 1) * pageSize)]);
    setIsLoading(false);
  }, [canLoadNextPage, delay, isLoading, data, pageSize]);

  return {
    isLoading: isLoading && pages.length === 0,
    isFetching: isLoading && pages.length > 0,
    totalPages,
    totalCount: data.length,
    pages,
    loadNextPage,
    canLoadNextPage,
  };
};
