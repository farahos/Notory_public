import mongoose from "mongoose";

const agreementSchema = new mongoose.Schema(
  {
    agreementDate: {
      type: Date,
      default: Date.now,
    },

    refNo: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    serviceType: {
      type: String,
      enum: ["Land", "Car", "Motor", "Share"],
      required: true,
    },

    serviceRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "serviceType",
    },

    agreementType: {
      type: String,
      required: true,
      enum : ["Beec", "Hibo", "Waqaf", ]
    },
    officeFee: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
     
    },

    // ================= DHINACA 1AAD =================
    dhinac1: {
      sellers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
      agents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
      guarantors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
    },

    // ================= DHINACA 2AAD =================
    dhinac2: {
      buyers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
      agents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
      guarantors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
    },

    witnesses: [
      {
        type: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Agreement", agreementSchema);
