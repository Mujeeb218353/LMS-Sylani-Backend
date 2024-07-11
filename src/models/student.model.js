import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const studentSchema = new Schema(
    {
        city:{ // from admin
            type: String,
            required: true,
        },
        course:{ // from admin
            type: String,
            required: true,
        },
        campus: { // from admin
            type: String,
            required: true,
        },
        classSchedule : {
            type: String,
            enum: ["Weekdays (Monday to Friday)", "Weekend (Saturday & Sunday)", "Both"],
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        fatherName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        CNIC:{
            type: String,
            required: true,
            unique: true,
        },
        gender: { // from admin
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        lastQualification: {
            type: String,
            enum: ["Matric", "Intermediate", "Bachelors", "Masters", "PhD", "Other"],
            required: true,
        },
        profile: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role:{
            type: String,
            default: "student",
            required: true,
        },
        dob:{
            type: Date,
            required: true,
        },
        enrolledClass:{
            type: Schema.Types.ObjectId,
            ref: "Class",
        },
        refreshToken:{
            type: String,
        },
        isVerified:{
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

studentSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

studentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

studentSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const Student = mongoose.model("Student", studentSchema);