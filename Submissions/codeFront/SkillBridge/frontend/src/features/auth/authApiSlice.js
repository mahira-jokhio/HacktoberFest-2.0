import { apiSlice } from "../../app/api";



export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        register:builder.mutation({
            query:(data)=>({
                url: "/auth/register",
                method: 'POST',
                body: data
            }),
            providesTags: ['auth', 'user']
        }),
        login:builder.mutation({
            query:(data)=>({
                url: "/auth/login",
                method: "POST",
                body: data
            }),
            providesTags: ['auth', 'user']
        }),
        logout: builder.query({
            query:()=>({
                url: "/auth/logout",
                method: "GET",
            }),
            invalidatesTags: ['auth', 'user']
        }),
    })
})


export const { useLoginMutation, useLazyLogoutQuery, useRegisterMutation} = authApiSlice