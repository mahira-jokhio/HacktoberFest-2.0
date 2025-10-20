import { Router } from "express";
import {  addCourse, getAllCourses, getCourseById, getTeacherCourses } from "../controllers/course.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router()


router.get("/all-courses", getAllCourses)
router.use(isAuthenticated)

router.post("/add-course", addCourse)

router.get("/get-teacher-courses", getTeacherCourses)

router.get('/get-a-course/:id', getCourseById)


export default router