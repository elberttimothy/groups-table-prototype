
import { useCallback, useMemo } from 'react';

import {
  createDataTableLoadingObject,
  type DataTableLoadingObject,
  isDataTableLoadingObject,
} from '@/utils';

type DataAccessorFn<Data, R> = (data: Data) => R;
type RowIdAccessor<Data> = DataAccessorFn<Data, string>;

export type GetRowIdLoadingGuard<Data> = (
  fn: RowIdAccessor<Data>,
) => (data: Data | DataTableLoadingObject, index: number) => string;

export type DataLoadingGuard<Data> = {
  <Fn extends DataAccessorFn<Data, unknown>>(
    data: Data | DataTableLoadingObject,
    fn: Fn,
  ): ReturnType<Fn> | undefined;
  <Fn extends DataAccessorFn<Data, unknown>, Default>(
    data: Data | DataTableLoadingObject,
    fn: Fn,
    defaultValue: Default,
  ): ReturnType<Fn> | Default;
};

interface UseDataTableLoadingGuardReturn<Data> {
  memoisedData: Data[] | DataTableLoadingObject[];
  getRowIdLoadingGuard: GetRowIdLoadingGuard<Data>;
  dataLoadingGuard: DataLoadingGuard<Data>;
}

const createDataLoadingGuard = <Data>() => {
  function dataLoadingGuard<Fn extends DataAccessorFn<Data, unknown>>(
    data: Data | DataTableLoadingObject,
    fn: Fn,
  ): ReturnType<Fn> | undefined;
  function dataLoadingGuard<Fn extends DataAccessorFn<Data, unknown>, Default>(
    data: Data | DataTableLoadingObject,
    fn: Fn,
    defaultValue: Default,
  ): ReturnType<Fn> | Default;

  /**
   * Guard a callback to prevent it from being executed while data is loading.
   */
  function dataLoadingGuard<Fn extends DataAccessorFn<Data, unknown>, Default>(
    data: Data | DataTableLoadingObject,
    fn: Fn,
    defaultValue?: Default,
  ) {
    if (isDataTableLoadingObject(data)) {
      return defaultValue;
    } else {
      return fn(data);
    }
  }

  return dataLoadingGuard;
};

interface UseTableLoadingGuardBaseProps<Data> {
  /**
   * Request is fetching for the first time. No data has been loaded yet.
   */
  isLoading: boolean;
  /**
   * Request is fetching, but might have some stale data.
   */
  isFetching?: boolean;
  /**
   * Request has never been fired.
   */
  isUninitialized?: boolean;

  data?: Data[];
}

interface UseTableLoadingGuardWithInitialRowCount<Data>
  extends UseTableLoadingGuardBaseProps<Data> {
  mode: 'dynamic';
  /**
   * The number of loading rows to show when the table is in a loading state (with no data).
   * Otherwise, the number of loading rows will match the length of `Data[]`.
   */
  initialRowCount: number;
}

interface UseTableLoadingGuardWithFixedRowCount<Data>
  extends UseTableLoadingGuardBaseProps<Data> {
  mode: 'fixed';
  /**
   * Always render this many rows while `isFetching/isLoading/isUninitialized` is `true`,
   * regardless of the length of `Data[]`.
   */
  rowCount: number;
}

type UseTableLoadingGuardProps<Data> =
  | UseTableLoadingGuardWithInitialRowCount<Data>
  | UseTableLoadingGuardWithFixedRowCount<Data>;

export const useDataTableLoadingGuard = <Data>({
  isLoading,
  isFetching,
  isUninitialized,
  data,
  mode = 'dynamic',
  ...options
}: UseTableLoadingGuardProps<Data>): UseDataTableLoadingGuardReturn<Data> => {
  const dataRowCount = data?.length ?? 0;
  const dataIsEmpty = dataRowCount === 0;
  const dataIsFetching = isLoading || isFetching || isUninitialized;

  const optionValues = Object.values(options);

  const memoisedData = useMemo(() => {
    if (!dataIsFetching) {
      return data ?? [];
    }

    if (mode === 'dynamic') {
      const { initialRowCount } = { initialRowCount: 10, ...options };

      if (dataIsEmpty) {
        return Array.from({ length: initialRowCount }).map(() =>
          createDataTableLoadingObject({}),
        );
      }

      return Array.from({ length: dataRowCount }).map(() =>
        createDataTableLoadingObject({}),
      );
    } else {
      const { rowCount } = { rowCount: 10, ...options };

      return Array.from({ length: rowCount }).map(() =>
        createDataTableLoadingObject({}),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dataIsEmpty, dataIsFetching, mode, ...optionValues, dataRowCount]);

  /**
   * Guard the `getRowId` function to prevent it from being called if the row is a loading object.
   */
  const getRowIdLoadingGuard = useCallback(
    (fn: DataAccessorFn<Data, string>) => {
      return (data: Data | DataTableLoadingObject, index: number) => {
        if (isDataTableLoadingObject(data)) {
          return index.toString();
        }
        return fn(data);
      };
    },
    [],
  );

  const dataLoadingGuard = useCallback(createDataLoadingGuard<Data>(), []); //eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(
    () => ({
      memoisedData,
      getRowIdLoadingGuard,
      dataLoadingGuard,
    }),
    [memoisedData, getRowIdLoadingGuard, dataLoadingGuard],
  );
};
