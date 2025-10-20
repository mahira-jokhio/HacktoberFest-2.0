import React, { useEffect, useState } from "react";
import pic from "../assets/pic.jpg"
import { useSelector } from "react-redux";
import { useLazyGetTeacherCoursesQuery } from "../features/course/courseApiSlice";
import DisplayCourses from "../components/DisplayCourses";

const Profile = () => {
    const user = useSelector((state)=> state.user?.user)
    const [get] = useLazyGetTeacherCoursesQuery()
    const [d, setD] = useState([])
    const getCourses = async()=>{
        const course = await get()
        setD(course?.data?.data)
    }
    useEffect(()=>{
        if(user?.role === "teacher"){
            getCourses()
        }
    },[user])
  return (
    <section className="mt-4 flex flex-col w-full justify-center items-center   dark:bg-zinc-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full max-w-sm text-center">
        <img
          src={user?.avatar || pic}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          {user?.name || "User Name"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{user?.email || "user@example.com"}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Role: {user?.role || "Student"}
        </p>

      </div>

        {user?.role === "teacher" && (
            <h1 className="my-4 text-4xl font-bold">Courses</h1>
        )}
     <DisplayCourses courses={d} />
    </section>
  );
};

export default Profile;
