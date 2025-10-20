import React from 'react'
import {useSelector} from "react-redux"
import { useGetAllCoursesQuery } from '../features/course/courseApiSlice'
import Loader from "../components/Loader"
import DisplayCourses from '../components/DisplayCourses'
const Home = () => {

  const user = useSelector((state)=> state.user?.user)
  
  const {data, isLoading } = useGetAllCoursesQuery()
  console.log(data)
  return (
    <section>
      <h1 className='text-center text-4xl mt-4'>{user?.name ? `Welcome To SkillBridge, ${user?.name}` :  "Welcome To SkillBridge"}</h1>
      {isLoading && <Loader/> }
       {data?.data?.length ? (
        <DisplayCourses courses={data?.data} />
        
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No courses available.
        </p>
      )}
    </section>
  )
}

export default Home