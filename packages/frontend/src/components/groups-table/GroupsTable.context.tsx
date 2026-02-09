import { createContext } from 'react';
import {
  ProductAggregation,
  LocationAggregation,
  type SkuLocationBody,
} from '@autone/backend/schemas';
import { useContext } from 'react';

export const GroupsTableFiltersContext = createContext<
  [SkuLocationBody['filters'][], (filterStack: SkuLocationBody['filters'][]) => void] | null
>(null);

export const useGroupsTableFilters = () => {
  const context = useContext(GroupsTableFiltersContext);
  if (!context) {
    throw new Error('useGroupsTableFilters must be used within a GroupsTableFiltersProvider');
  }
  return context;
};

type GroupsTableAggregationContextValue = {
  productAggregation: ProductAggregation[];
  setProductAggregation: (productAggregation: ProductAggregation[]) => void;
  locationAggregation: LocationAggregation[];
  setLocationAggregation: (locationAggregation: LocationAggregation[]) => void;
} | null;

export const GroupsTableAggregationContext =
  createContext<GroupsTableAggregationContextValue>(null);

export const useGroupsTableAggregation = () => {
  const context = useContext(GroupsTableAggregationContext);
  if (!context) {
    throw new Error(
      'useGroupsTableAggregation must be used within a GroupsTableAggregationProvider'
    );
  }
  return context;
};
