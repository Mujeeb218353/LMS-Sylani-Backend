import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { City } from "../models/city.model.js"

const addCity = asyncHandler(async (req, res) => {
    const { cityName } = req.body

    if (!cityName) {
        throw new apiError(400, "City name is required")
    }

    const city = await City.findOne({ cityName })

    if (city) {
        throw new apiError(400, "City already exists")
    }

    const newCity = new City({
        cityName
    })

    await newCity.save()

    res.status(201).json( new apiResponse(201, newCity, "City added successfully"))
})

const getCity = asyncHandler(async (req, res) => {
    const cities = await City.find()
    res.status(200).json(new apiResponse(200, cities, "Cities fetched successfully"))
})

export {
    addCity,
    getCity,
}