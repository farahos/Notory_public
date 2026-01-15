import mongoose from "mongoose";

const refCounterSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
  },
  lastNumber: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("RefCounter", refCounterSchema);
