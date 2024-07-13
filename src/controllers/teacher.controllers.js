import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Teacher } from "../models/teacher.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const cookieOptions = {
    httpOnly: true,
    secure: true,
};

const generateAccessAndRefreshToken = async (teacherId) => {
    try {
        const teacher = await Teacher.findById(teacherId);
        const accessToken = teacher.generateAccessToken();
        const refreshToken = teacher.generateRefreshToken();
        teacher.refreshToken = refreshToken;
        await teacher.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiError(
            500,
            "Something went wrong while generating access and refresh token"
        );
    }
};

const registerTeacher = asyncHandler(async (req, res) => {
    const {
        fullName,
        email,
        password,
        role,
        gender,
        phoneNumber,
        city,
        campus,
        course,
        userId
    } = req.body;
    if (
        [
            fullName,
            email,
            password,
            role,
            gender,
            phoneNumber,
            city,
            campus,
            course
        ].some((field) => String(field).trim() === "")

    ) {
        throw new apiError(400, "All fields are required");
    }

    const profileLocalPath = req.file?.path

    if (!profileLocalPath) {
        throw new apiError(400, "Profile image is required")
    }

    const profile = await uploadOnCloudinary(profileLocalPath)

    if (!profile) {
        throw new apiError(400, "Profile image upload failed")
    }

    const existedTeacher = await Teacher.findOne({
        email,
    });

    if (existedTeacher) {
        throw new apiError(400, "User already exists");
    }

    const newTeacher = new Teacher({
        fullName,
        email,
        password,
        fullName,
        email,
        profile: profile.secure_url,
        password,
        role,
        gender,
        phoneNumber,
        city,
        campus,
        course,
        createdBy: userId
    }
    )

    await newTeacher.save();

    const createdTeacher = await Teacher.findById(newTeacher._id).select("-password -refreshToken");

    if (!createdTeacher) {
        throw new apiError(500, "Something went wrong while creating user");
    }

    res.status(201).json(new apiResponse(200, createdTeacher, "User created successfully"));

});

const loginTeacher = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new apiError(400, "Email is required");
    }

    if (!password) {
        throw new apiError(400, "Password is required");
    }

    const teacher = await Teacher.findOne({
        email,
    });

    if (!teacher) {
        throw new apiError(400, "Teacher not found");
    }

    const isPasswordCorrect = await teacher.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new apiError(401, "email or password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        teacher._id
    );

    const loggedInTeacher = await Teacher.findById(teacher._id).select("-password -refreshToken");

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
                    teacher: loggedInTeacher,
                    accessToken,
                    refreshToken,
                },
                "Logged in Successfully"
            )
        );
});

const logoutTeacher = asyncHandler(async (req, res) => {
    await Teacher.findByIdAndUpdate(
        req.teacher?._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );
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
                "Logged out successfully"
            )
        );
});

const getCurrentTeacher = asyncHandler(async (req, res) => {
    res.status(200).json(new apiResponse(200, req.teacher, "teacher fetched successfully"));
});

const refreshTeacherAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const teacher = await Teacher.findById(decodedToken?._id);

        if (!teacher) {
            throw new apiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== teacher?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(teacher._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token");
    }
});


export {
    registerTeacher,
    loginTeacher,
    logoutTeacher,
    getCurrentTeacher,
    refreshTeacherAccessToken,
};