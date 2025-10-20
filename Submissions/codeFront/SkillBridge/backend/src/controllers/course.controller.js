import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {User} from "../models/user.models.js"
import { apiResponse } from "../utils/apiResponse.js"
import { Course } from "../models/course.model.js"


const getAllCourses = asyncHandler(async (req,res) => {
    // const user = req.user

    // if(!user){
    //     throw new apiError(400, "user is not logged in")
    // }
    const courses = await Course.find().populate("teacher")
    res.status(200).json(new apiResponse(200, courses, "Courses fetched"))
})

const getCourseById = asyncHandler(async (req,res) => {
    const user = req.user

    if(!user){
        throw new apiError(400, "user is not logged in")
    }
    const {id} = req.params
    if(!id){
        throw new apiError(400, "All fields are required")
    }
    const courses = await Course.findById(id).populate("teacher")
    res.status(200).json(new apiResponse(200, courses, "Course fetched"))
})


const getTeacherCourses = asyncHandler(async (req, res) => {
  const user = req.user
    if(!user){
        throw new apiError(400, "user is not logged in")
    }
    if(user.role !== "teacher"){
        throw new apiError(400, "Not authorized")
    }


  const courses = await Course.find({ teacher: user._id }).populate("teacher");

  if (!courses.length) {
    throw new apiError(404, "No courses found for this teacher");
  }

  res.status(200).json(new apiResponse(200, courses, "Courses fetched successfully"));
});


const addCourse = asyncHandler(async (req,res) => {
    const user = req.user
    const {name, description, video} = req.body
    if(!user){
        throw new apiError(400, "user is not logged in")
    }
    if(user.role !== "teacher"){
        throw new apiError(400, "Not authorized")
    }

    if(!name || !description || !video){
        throw new apiError(400, "All fields are required")
    }
    const courses = await Course.create({
        name,
        description,
        video,
        teacher: user._id
    })
    res.status(200).json(new apiResponse(200, courses, "Course created"))
})


export {getAllCourses, addCourse, getTeacherCourses, getCourseById}