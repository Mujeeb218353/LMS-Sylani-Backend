import mongoose, { Schema } from 'mongoose';

const citySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const City = mongoose.model('City', citySchema);

export default City;