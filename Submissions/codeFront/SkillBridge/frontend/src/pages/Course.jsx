import React, { useEffect, useState } from "react";
import { useLazyGetACourseQuery } from "../features/course/courseApiSlice";
import { Link, useParams } from "react-router-dom";

const Course = () => {
    // const course = {title:"sdf", videoId: "sdfsff", description: "sdfs"}
    const [course, setCourse] = useState([])
const p = useParams()
console.log(p)
    const [get] = useLazyGetACourseQuery()

    const getCourse = async () => {
        const c = await get(p?.id)
        console.log(c)
        setCourse(c?.data?.data)
    }

    useEffect(()=>{
        getCourse()
    },[])
  return (
    <section className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex flex-col justify-center items-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4 text-center">
          {course?.name || "Course Title"}
        </h1>

        <div className="aspect-video mb-4">
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${
    course?.video?.[0]?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || "dQw4w9WgXcQ"
  }`}
            title={course?.title || "Course Video"}
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-700 dark:text-gray-300">
          {course?.description || "This is a short description of the course."}
        </p>

        <p className="text-primary dark:text-white text-xl mt-4">
          Teacher: <strong className="font-bold">{course?.teacher?.name }</strong>
        </p>
      </div>

      <Link to={"/"} className="btn-primary mt-4">Go Back</Link>
    </section>
  );
};

export default Course;
