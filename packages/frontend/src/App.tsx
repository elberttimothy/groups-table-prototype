import { LocationAggregation, ProductAggregation } from '@autone/backend/schemas';
import { useGetHealthQuery, useGetSkuLocationsQuery } from './store/api';
import { useState } from 'react';

function App() {
  const { data } = useGetHealthQuery();
  const [productAggregation, setProductAggregation] = useState<ProductAggregation>('sku_id');
  const [locationAggregation, setLocationAggregation] =
    useState<LocationAggregation>('location_id');
  const { data: skuLocations, isLoading: isLoadingSkuLocations } = useGetSkuLocationsQuery({
    product_aggregation: 'sku_id',
    location_aggregation: 'location_id',
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
        <div className="flex flex-col overflow-y-scroll h-full border">
          <pre>{JSON.stringify(skuLocations, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
