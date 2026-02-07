import mongoose from "mongoose";

const SaamiSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
     
    },
    SaamiDate: {
      type: Date,
    },

}

);

export default mongoose.model("Saami", SaamiSchema);
