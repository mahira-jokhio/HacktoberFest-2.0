import { apiSlice } from "../../app/api";


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query({
            query:()=>({
                url: "/user/me",
                // validateStatus: (response, result)=>{
                // return response.status === 200 &&  !result.isError
                // },
            }),
            providesTags:['user'],

        })
    })
})


export const { useGetUserQuery, useLazyGetUserQuery } = userApiSlice