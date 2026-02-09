import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from '@/atoms';

interface DrilldownContextMenuProps {
  dimension: 'product' | 'location';
}

export const DrilldownContextMenu = ({ dimension }: DrilldownContextMenuProps) => {
  if (dimension === 'product') {
    return <ProductDrilldownContextMenu />;
  }
  if (dimension === 'location') {
    return <LocationDrilldownContextMenu />;
  }
  return null;
};

const ProductDrilldownContextMenu = () => {
  return (
    <ContextMenuContent>
      <ContextMenuLabel>Drilldown product dimension</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem>Product</ContextMenuItem>
      <ContextMenuItem>Product Group</ContextMenuItem>
      <ContextMenuItem>Department</ContextMenuItem>
      <ContextMenuItem>Sub Department</ContextMenuItem>
      <ContextMenuItem>Style</ContextMenuItem>
      <ContextMenuItem>Season</ContextMenuItem>
      <ContextMenuItem>Gender</ContextMenuItem>
      <ContextMenuItem>SKU</ContextMenuItem>
    </ContextMenuContent>
  );
};

const LocationDrilldownContextMenu = () => {
  return (
    <ContextMenuContent>
      <ContextMenuLabel>Drilldown location dimension</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem>Location</ContextMenuItem>
      <ContextMenuItem>Country</ContextMenuItem>
      <ContextMenuItem>Location Type</ContextMenuItem>
      <ContextMenuItem>Region</ContextMenuItem>
    </ContextMenuContent>
  );
};
