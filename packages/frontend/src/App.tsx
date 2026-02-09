import { LocationAggregation, ProductAggregation } from '@autone/backend/schemas';
import { useGetHealthQuery, useGetSkuLocationsQuery } from './store/api';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './atoms';

function App() {
  const { data } = useGetHealthQuery();
  const [productAggregation, setProductAggregation] = useState<ProductAggregation>('sku_id');
  const [locationAggregation, setLocationAggregation] =
    useState<LocationAggregation>('location_id');
  const { data: skuLocations, isLoading: isLoadingSkuLocations } = useGetSkuLocationsQuery({
    product_aggregation: productAggregation,
    location_aggregation: locationAggregation,
  });

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-8 p-8 border">
      <div className="flex flex-col border">
        <h1>Health: {data?.status}</h1>
        <p>Database: {data?.database}</p>
      </div>
      <div className="flex flex-col grow h-full border">
        <h1>SKU Locations</h1>
        <p>Loading: {isLoadingSkuLocations ? 'Yes' : 'No'}</p>
        <div className="flex gap-2">
          <Select
            value={productAggregation}
            onValueChange={(value) => setProductAggregation(value as ProductAggregation)}
          >
            <SelectTrigger aria-label="Product Aggregation" id="product-aggregation">
              <SelectValue placeholder="Select Product Aggregation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sku_id">SKU ID</SelectItem>
              <SelectItem value="product_id">Product ID</SelectItem>
              <SelectItem value="department_id">Department ID</SelectItem>
              <SelectItem value="sub_department_id">Sub Department ID</SelectItem>
              <SelectItem value="style_id">Style ID</SelectItem>
              <SelectItem value="season_id">Season ID</SelectItem>
              <SelectItem value="gender_id">Gender ID</SelectItem>
              <SelectItem value="product_groups">Product Groups</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={locationAggregation}
            onValueChange={(value) => setLocationAggregation(value as LocationAggregation)}
          >
            <SelectTrigger aria-label="Location Aggregation" id="location-aggregation">
              <SelectValue placeholder="Select Location Aggregation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="location_id">Location ID</SelectItem>
              <SelectItem value="country_id">Country ID</SelectItem>
              <SelectItem value="location_type_id">Location Type ID</SelectItem>
              <SelectItem value="region_id">Region ID</SelectItem>
              <SelectItem value="location_groups">Location Groups</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col overflow-y-scroll h-full border">
          <pre className="text-xs">{JSON.stringify(skuLocations, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
