import { asyncHandler } from "../utils/asyncHandler.js";
import { Campus } from "../models/campus.model.js";
import { City } from "../models/city.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

const addCampus = asyncHandler(async (req, res) => {
  const { name, cityId } = req.body;

  if (!name) {
    throw new apiError(400, "Campus name is required");
  }
  if (!cityId) {
    throw new apiError(400, "City is required");
  }

  const city = await City.findById(cityId);

  if (!city) {
    throw new apiError(404, "City not found");
  }

  const newCampus = new Campus({
    name,
    city: cityId
  });

  await newCampus.save();

  res.status(201).json(new apiResponse(201, newCampus, "Campus added successfully"));
});



const getCampus = asyncHandler(async (req, res) => {
  const campuses = await Campus.find();
  res.status(200).json(new apiResponse(200, campuses, "Campuses fetched successfully"));
})

export {
    addCampus,
    getCampus,
}