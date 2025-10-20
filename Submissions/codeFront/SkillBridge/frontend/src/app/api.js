import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL,
        credentials: 'include',
    }),
    tagTypes: ['user', 'auth', 'course'],
    endpoints:builder =>({})
})