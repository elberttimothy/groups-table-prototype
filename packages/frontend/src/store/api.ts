import { GenericAggregationResponse, HealthResponse, SkuLocationBody } from '@autone/backend/schemas';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';


// Define a base API slice with RTK Query
// Add endpoints by extending this API using `api.injectEndpoints()`
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => '/health/test',
      transformResponse: (response: HealthResponse) => response,
    }),
    getSkuLocations: builder.query<GenericAggregationResponse[], SkuLocationBody>({
      query: (body) => ({
        url: '/sku-locations',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetHealthQuery, useGetSkuLocationsQuery } = api;