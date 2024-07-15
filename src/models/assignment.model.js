import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
    {
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        className: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        assignedDate: {
            type: Date,
            default: Date.now,
        },
        lastDate: {
            type: Date,
            required: true,
        },
        submittedBy: [
            {
                studentId: {
                    type: Schema.Types.ObjectId,
                    ref: "Student",
                    required: true,
                },
                marks: {
                    type: Number,
                },
                link:{
                    type: String,
                }
            },
        ]
    },
    {
        timestamps: true
    }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema)