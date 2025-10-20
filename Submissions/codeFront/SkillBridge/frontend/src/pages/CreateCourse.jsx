import React, { useState } from "react";
import { useSelector } from "react-redux";
import {useCreateCourseMutation} from "../features/course/courseApiSlice"
import {useNavigate} from "react-router-dom"

const CreateCourse = () => {
    const navigate = useNavigate()
    const user = useSelector((state)=> state.user?.user)
  const [course, setCourse] = useState({
    title: "",
    description: "",
    video: "",
    teacher: user?.name
  });

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const [create, {error}] = useCreateCourseMutation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(course);

    await create({name: course.title, description: course.description, video: course.video })
    setCourse({})
    navigate("/")

  };

  console.log(error)

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6 text-center">
          Create New Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter course description"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Youtube Link
            </label>
            <input
              type="text"
              name="video"
              value={course.video}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="www.youtube.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Create Course
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateCourse;