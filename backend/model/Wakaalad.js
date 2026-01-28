import mongoose from "mongoose";

const wakaladSchema = new mongoose.Schema(
  {
  

    wakaladType: {
      type: String,
      enum: ["Wakaalad Guud", "Wakaalad Gaar", "Qayim", "DhaxalKoob"],
      required: true,
    },

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

    xafiisKuYaal: {
      type: String,
      required: true,
    },

    saxiix1: {
      type: String,
      required: true,
    },

    saxiix2: {
      type: String,
      
    },
  },
  { timestamps: true }
);

export default mongoose.model("Wakaalad", wakaladSchema);
