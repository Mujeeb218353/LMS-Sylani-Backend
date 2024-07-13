import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { Admin } from "../models/admin.model.js"
import { Teacher } from "../models/teacher.model.js"
import { Student } from "../models/student.model.js"
import { City } from "../models/city.model.js"
import { Campus } from "../models/campus.model.js"
import { Course } from "../models/course.model.js"
import { Class } from "../models/class.model.js"

const addClass = asyncHandler(async (req, res) => {
    const {
        name,
        enrollmentKey,
        batch,
        timing,
        teacherId,
        cityId,
        courseId,
        campusId,
        userId
    } = req.body

    if(!name){
        throw new apiError(400, "Class name is required")
    }

    if(!enrollmentKey){
        throw new apiError(400, "Enrollment key is required")
    }

    if(!batch){
        throw new apiError(400, "Batch is required")
    }

    if(!timing){
        throw new apiError(400, "Timing is required")
    }

    if(!teacherId){
        throw new apiError(400, "Teacher is required")
    }

    if(!cityId){
        throw new apiError(400, "City is required")
    }

    if(!courseId){
        throw new apiError(400, "Course is required")
    }

    if(!campusId){
        throw new apiError(400, "Campus is required")
    }

    if(!userId){
        throw new apiError(400, "User is required")
    }

    const user = await Admin.findById({ _id: userId })
    const teacher = await Teacher.findById({ _id: teacherId })
    const city = await City.findById({ _id: cityId });
    const campus = await Campus.findById({ _id: campusId });
    const course = await Course.findById({ _id: courseId });

    if(!user){
        throw new apiError(404, "Unauthorized user")
    }

    if(!teacher){
        throw new apiError(404, "Teacher not found")
    }

    if(!city){
        throw new apiError(404, "City not found")
    }

    if(!campus){
        throw new apiError(404, "Campus not found")
    }

    if(!course){
        throw new apiError(404, "Course not found")
    }

    const newClass = new Class({
        name,
        enrollmentKey,
        batch,
        timing,
        teacher: teacherId,
        city: cityId,
        course: courseId,
        campus: campusId,
        createdBy: userId
    })

    await newClass.save()

    res.status(201).json(new apiResponse(201, newClass, "Class created successfully"));
})

const getTeachersByCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.query;

    if (!courseId) {
        throw new apiError(400, "Course is required");
    }

    const teachers = await Teacher.find({ course: courseId });

    res.status(200).json(new apiResponse(200, teachers, "Teachers fetched successfully"));
});


const getClass = asyncHandler(async (req, res) => {
    const savedClass = await Class.findById({ _id: req.params.id }).populate("teacher").populate("city").populate("campus").populate("course").populate("createdBy")
    res.status(200).json(new apiResponse(200, savedClass, "Class fetched successfully"));
})

const getClasses = asyncHandler(async (req, res) => {
    const classes = await Class.find({}).populate("teacher").populate("city").populate("campus").populate("course").populate("createdBy")
    res.status(200).json(new apiResponse(200, classes, "Classes fetched successfully"));
})

export { 
    addClass,
    getClass,
    getClasses,
    getTeachersByCourse,
}