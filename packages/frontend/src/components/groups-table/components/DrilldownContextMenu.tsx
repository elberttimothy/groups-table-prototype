import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from '@/atoms';
import { LocationAggregation, ProductAggregation } from '@autone/backend/schemas';

interface DrilldownContextMenuProps {
  dimension: 'product' | 'location';
  onDrilldown: (
    arg:
      | {
          dimension: 'product';
          aggregation: ProductAggregation;
        }
      | {
          dimension: 'location';
          aggregation: LocationAggregation;
        }
  ) => void;
}

export const DrilldownContextMenu = ({ dimension, onDrilldown }: DrilldownContextMenuProps) => {
  if (dimension === 'product') {
    return <ProductDrilldownContextMenu onDrilldown={onDrilldown} />;
  }
  if (dimension === 'location') {
    return <LocationDrilldownContextMenu onDrilldown={onDrilldown} />;
  }
  return null;
};

const ProductDrilldownContextMenu = ({
  onDrilldown,
}: Omit<DrilldownContextMenuProps, 'dimension'>) => {
  return (
    <ContextMenuContent>
      <ContextMenuLabel>Drilldown product dimension</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'product', aggregation: 'product_id' })}
      >
        Product
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'product', aggregation: 'product_group' })}
      >
        Product Group
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'product', aggregation: 'department_id' })}
      >
        Department
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'product', aggregation: 'sub_department_id' })}
      >
        Sub Department
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'product', aggregation: 'style_id' })}
      >
        Style
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'product', aggregation: 'season_id' })}
      >
        Season
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'product', aggregation: 'gender_id' })}
      >
        Gender
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onDrilldown({ dimension: 'product', aggregation: 'sku_id' })}>
        SKU
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

const LocationDrilldownContextMenu = ({
  onDrilldown,
}: Omit<DrilldownContextMenuProps, 'dimension'>) => {
  return (
    <ContextMenuContent>
      <ContextMenuLabel>Drilldown location dimension</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'location', aggregation: 'location_id' })}
      >
        Location
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'location', aggregation: 'country_id' })}
      >
        Country
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'location', aggregation: 'location_type_id' })}
      >
        Location Type
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'location', aggregation: 'region_id' })}
      >
        Region
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => onDrilldown({ dimension: 'location', aggregation: 'location_group' })}
      >
        Location Group
      </ContextMenuItem>
    </ContextMenuContent>
  );
};
