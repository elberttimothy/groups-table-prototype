import { useGetHealthQuery, useGetSkuLocationsQuery } from './store/api';

function App() {
  const { data } = useGetHealthQuery()
  const { data: skuLocations, isLoading: isLoadingSkuLocations } = useGetSkuLocationsQuery({
    product_aggregation: 'sku_id',
    location_aggregation: 'location_id',
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className='flex flex-col'>
        <h1>Health: {data?.status}</h1>
        <p>Database: {data?.database}</p>
      </div>
      <div className='flex flex-col'>
        <h1>SKU Locations</h1>
        <p>Loading: {isLoadingSkuLocations ? 'Yes' : 'No'}</p>
        <pre>{JSON.stringify(skuLocations, null, 2)}</pre>
      </div>
    </div>
  )
}

export default App

