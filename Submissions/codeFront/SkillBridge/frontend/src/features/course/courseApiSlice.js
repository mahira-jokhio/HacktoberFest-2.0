import { apiSlice } from "../../app/api";


export const courseApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllCourses: builder.query({
            query:()=>({
                url: "/course/all-courses",
                // validateStatus: (response, result)=>{
                // return response.status === 200 &&  !result.isError
                // },
            }),
            providesTags:['course'],

        }),
        getACourse: builder.query({
            query:(data)=>({
                url: `/course/get-a-course/${data}`,
                // validateStatus: (response, result)=>{
                // return response.status === 200 &&  !result.isError
                // },
                
            }),
            providesTags:['course'],

        }),
        getTeacherCourses: builder.query({
            query:()=>({
                url: "/course/get-teacher-courses",
                // validateStatus: (response, result)=>{
                // return response.status === 200 &&  !result.isError
                // },
            }),
            providesTags:['course'],

        }),
        createCourse: builder.mutation({
            query:(data)=>({
                url: "/course/add-course",
                method: 'POST',
                body: data
                // validateStatus: (response, result)=>{
                // return response.status === 200 &&  !result.isError
                // },
            }),
            invalidatesTags:['course'],

        })
    })
})


export const { useGetAllCoursesQuery, useCreateCourseMutation, useLazyGetTeacherCoursesQuery, useLazyGetACourseQuery } = courseApiSlice