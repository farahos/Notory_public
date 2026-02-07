import mongoose from "mongoose";

const MootocycleSchema = new mongoose.Schema(
  {
   
    // Nooca mootada
    type: {
      type: String,
      required: true,
      trim: true,
    },

    // Chassis number
    chassisNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Model & Midab (Fadlan Qor)
    modelYear: {
      type: Number,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    // Cylinder
    cylinder: {
      type: Number,
      required: true,
    },

    // Taargo
    plateNo: {
      type: String,
      required: true,
      trim: true,
    },

    plateIssueDate: {
      type: Date,
      required: true,
    },

    // Ku Milkiyad (Buug / Kaarka)
    ownershipType: {
      type: String,
      enum: ["Buug", "Kaarka"],
      default: "Buug",
    },

    ownershipBookNo: {
      type: String,
      required: true,
    },

    ownershipIssueDate: {
      type: Date,
      required: true,
    },

    // 🏛️ WASAARADDA (DEFAULT – mar walba isku mid)
    issuedByPlate: {
      type: String,
      default: "WASAARADDA GAADIIDKA & DUULISTA HAWADA",
      immutable: true, // lama beddeli karo
    },

    issuedByOwnership: {
      type: String,
      default: "WASAARADDA GAADIIDKA JFS",
      immutable: true, // lama beddeli karo
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mooto", MootocycleSchema);
