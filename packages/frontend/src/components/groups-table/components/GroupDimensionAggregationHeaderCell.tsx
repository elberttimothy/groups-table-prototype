import { LocationAggregation, ProductAggregation } from '@autone/backend/schemas';
import { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/atoms';
import { useDrilldownContext } from '../GroupsTable.context';
import { GroupsTableParameters } from '@/App';

const productAggregationOptions: { value: ProductAggregation; label: string }[] = [
  { value: 'sku_id', label: 'SKU ID' },
  { value: 'product_id', label: 'Product ID' },
  { value: 'department_id', label: 'Department ID' },
  { value: 'sub_department_id', label: 'Sub Department ID' },
  { value: 'style_id', label: 'Style ID' },
  { value: 'season_id', label: 'Season ID' },
  { value: 'gender_id', label: 'Gender ID' },
  { value: 'product_group', label: 'Product Group' },
];

const locationAggregationOptions: { value: LocationAggregation; label: string }[] = [
  { value: 'location_id', label: 'Location ID' },
  { value: 'country_id', label: 'Country ID' },
  { value: 'location_type_id', label: 'Location Type ID' },
  { value: 'region_id', label: 'Region ID' },
  { value: 'location_group', label: 'Location Group' },
];

interface DimensionHeaderCellProps {
  dimension: 'product' | 'location';
  defaultAggregation: string;
}

export const DimensionHeaderCell = ({
  dimension,
  defaultAggregation,
}: DimensionHeaderCellProps) => {
  const [_, { changeTopPartial }] = useDrilldownContext<GroupsTableParameters>();

  // Local state for optimistic updates
  const [localValue, setLocalValue] = useState(defaultAggregation);

  const options = dimension === 'product' ? productAggregationOptions : locationAggregationOptions;

  const handleValueChange = (value: string) => {
    // Optimistically update local state immediately
    setLocalValue(value);

    // Then update the context
    setTimeout(() => {
      if (dimension === 'product') {
        changeTopPartial({ productAggregation: value as ProductAggregation });
      } else {
        changeTopPartial({ locationAggregation: value as LocationAggregation });
      }
    });
  };

  return (
    <Select value={localValue} onValueChange={handleValueChange}>
      <SelectTrigger
        aria-label={`${dimension} Aggregation`}
        id={`${dimension}-aggregation`}
        className="h-7 border-none shadow-none bg-transparent hover:bg-muted/50 focus:ring-0 capitalize"
      >
        <SelectValue placeholder={`Select ${dimension} Aggregation`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
