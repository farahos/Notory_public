import mongoose from "mongoose";

const tasdiiqSchema = new mongoose.Schema(
  {
   

    refNo: {
      type: String,
      required: true,
    
    },

    date: {
      type: Date,
      required: true,
    },

    kasooBaxday: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tasdiiq", tasdiiqSchema);
