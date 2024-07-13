import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        enrollmentKey: {
            type: String,
            required: true,
            unique: true,
        },
        batch: {
            type: String,
            required: true
        },
        timing: {
            type: String,
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        students: [
            {
                studentId: {
                    type: Schema.Types.ObjectId,
                    ref: "Student",
                }
            }
        ],
        city: {
            type: Schema.Types.ObjectId,
            ref: "City",
            required: true
        },
        campus: {
            type: Schema.Types.ObjectId,
            ref: "Campus",
            required: true
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },
    },
    {
        timestamps: true,
    }
)

export const Class = mongoose.model("Class", classSchema);