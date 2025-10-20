import React from 'react'
import { Link } from 'react-router-dom'

const DisplayCourses = ({courses}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {courses?.map((course) => (
            <Link
              to={`/course/${course._id}`}
              key={course._id}
              className="bg-white w-[90%] m-auto md:w-full border dark:bg-gray-800 rounded-xl shadow-md p-5 hover:scale-[1.02] transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {course.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {course.description}
              </p>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {course.teacher?.name}
              </span>
            <br />
              <button className='btn-primary mt-2'>
                Enroll
              </button>
            </Link>
          ))}
        </div>
    
  )
}

export default DisplayCourses