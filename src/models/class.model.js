import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        enrollmentKey: {
            type: String,
            required: true,
            unique: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "Student",
            }
        ]
    },
    {
        timestamps: true,
    }
)

export const Class = mongoose.model("Class", classSchema);