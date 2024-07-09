import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { Student } from "../models/student.model.js"
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const cookieOptions = {
    httpOnly: true,
    secure: true,
}

const generateAccessAndRefreshToken = async (studentId) => {
    try {
        const student = await Student.findById(studentId)
        const accessToken = student.generateAccessToken()
        const refreshToken = student.generateRefreshToken()

        student.refreshToken = refreshToken
        await student.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(
            500,
            "Something went wrong while generating access and refresh token"
        )
    }
}

const generateStudentAccessToken = async (studentId) => {
    try {
        const student = await Student.findById(studentId)
        return student.generateAccessToken()
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access token")
    }
}

const registerStudent = asyncHandler(async (req, res) => {
    const {
        city,
        course,
        campus,
        classSchedule,
        fullName,
        fatherName,
        email,
        phoneNumber,
        CNIC,
        gender,
        address,
        lastQualification,
        password,
        dob
    } = req.body
    if (
        [
            city,
            course,
            campus,
            classSchedule,
            fullName,
            fatherName,
            email,
            phoneNumber,
            CNIC,
            gender,
            address,
            lastQualification,
            password,
            dob
        ].some((field) => String(field).trim() === "")

    ) {
        throw new apiError(400, "All fields are required")
    }

    const existedStudent = await Student.findOne({
        email,
        CNIC,
    })

    if (existedStudent) {
        throw new apiError(400, "Student already exists")
    }

    const profileLocalPath = req.file?.path

    if (!profileLocalPath) {
        throw new apiError(400, "Profile image is required")
    }

    const profile = await uploadOnCloudinary(profileLocalPath)

    if (!profile) {
        throw new apiError(400, "Profile image upload failed")
    }

    const newStudent = new Student({
        city,
        course,
        campus,
        classSchedule,
        fullName,
        fatherName,
        email,
        phoneNumber,
        CNIC,
        gender,
        address,
        dob,
        lastQualification,
        password,
        profile: profile.secure_url,
    }
    )


    await newStudent.save()

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newStudent._id)


    const createdStudent = await Student.findById(newStudent._id).select("-password -refreshToken")

    if (!createdStudent) {
        throw new apiError(500, "Something went wrong while creating user")
    }

    res.status(201)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(new apiResponse(
            200,
            {
                student: createdStudent,
                accessToken,
                refreshToken
            },
            "Student created successfully"
        ))

})

const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        throw new apiError(400, "Email is required")
    }

    if (!password) {
        throw new apiError(400, "Password is required")
    }

    const student = await Student.findOne({
        email,
    })

    if (!student) {
        throw new apiError(400, "Student not found")
    }

    const isPasswordCorrect = await student.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new apiError(401, "email or password is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        student._id
    )

    const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken")

    res.status(200)
        .cookie(
            "refreshToken",
            refreshToken,
            cookieOptions
        )
        .cookie(
            "accessToken",
            accessToken,
            cookieOptions
        )
        .json(
            new apiResponse(
                200,
                {
                    student: loggedInStudent,
                    accessToken,
                    refreshToken,
                },
                "Student Logged in Successfully"
            )
        )
})

const logoutStudent = asyncHandler(async (req, res) => {
    await Student.findByIdAndUpdate(
        req.student?._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    )
    res.status(200)
        .clearCookie(
            "accessToken",
            cookieOptions
        )
        .clearCookie(
            "refreshToken",
            cookieOptions
        )
        .json(
            new apiResponse(
                200,
                null,
                "Student logged out successfully"
            )
        )
})

const getCurrentStudent = asyncHandler(async (req, res) => {
    res.status(200).json(new apiResponse(200, req.student, "Student fetched successfully"))
})

const refreshStudentAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!incomingRefreshToken) {
        throw new apiError(401, "unauthorized request 1234")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        console.log("decodedToken: ", decodedToken);
        const student = await Student.findById(decodedToken?._id)

        if (!student) {
            throw new apiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== student?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used")
        }
        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(student._id);
        console.log("newRefreshToken: ", refreshToken);
        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                options
            )
            .cookie(
                "refreshToken",
                refreshToken,
                options
            )
            .json(
                new apiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: refreshToken
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }
})


export {
    registerStudent,
    loginStudent,
    logoutStudent,
    getCurrentStudent,
    refreshStudentAccessToken,
}