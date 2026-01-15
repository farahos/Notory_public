import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
     
    },
    shareDate: {
      type: Date,
    },

}

);

export default mongoose.model("Share", shareSchema);
