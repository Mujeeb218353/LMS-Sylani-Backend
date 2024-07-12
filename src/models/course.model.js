import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    campus: {
      type: Schema.Types.ObjectId,
      ref: 'Campus',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Course = mongoose.model('Course', courseSchema);