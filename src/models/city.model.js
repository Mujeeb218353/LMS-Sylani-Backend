import mongoose, { Schema } from "mongoose";

const citySchema = new Schema(
  {
    cityName: {
      type: String,
      required: true,
      unique: true
    },
  },
  {
    timestamps: true
  }
);

export const City = mongoose.model('City', citySchema);