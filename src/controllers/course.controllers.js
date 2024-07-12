import { asyncHandler } from "../utils/asyncHandler.js";
import { Campus } from "../models/campus.model.js";
import { City } from "../models/city.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Course } from "../models/course.model.js";

const addCourse = asyncHandler(async (req, res) => {

    const { name, cityId, campusId } = req.body;

    if (!name) {
        throw new apiError(400, "Course name is required");
    }

    if (!cityId) {
        throw new apiError(400, "City is required");
    }

    if (!campusId) {
        throw new apiError(400, "Campus is required");
    }

    const city = await City.findById(cityId);
    const campus = await Campus.findById(campusId);

    if (!city) {
        throw new apiError(404, "City not found");
    }

    if (!campus) {
        throw new apiError(404, "Campus not found");
    }

    const newCourse = new Course({
        name,
        city: cityId,
        campus: campusId
    });

    await newCourse.save();

    res.status(201).json(new apiResponse(201, newCourse, "Course added successfully"));

})

const getCourse = asyncHandler(async (req, res) => {
    const courses = await Course.find()
    res.status(200).json(new apiResponse(200, courses, "Courses fetched successfully"))
})

export { 
    addCourse, 
    getCourse 
}