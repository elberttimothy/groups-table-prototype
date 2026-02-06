import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a base API slice with RTK Query
// Add endpoints by extending this API using `api.injectEndpoints()`
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // Add default headers or credentials here if needed
    // prepareHeaders: (headers) => {
    //   return headers;
    // },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
