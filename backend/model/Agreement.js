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

   service: {
  type: String,
  enum: ["Wareejin", "Wakaalad"],
  required: true,
},

serviceType: {
  type: String,
  enum: [
    "Land",
    "Car",
    "Motor",
    "Share",
    "Wakaalad Guud",
    "Wakaalad Gaar",
  ],
  required: true,
},


    serviceRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "serviceType",
    },

    agreementType: {
      type: String,
    
      enum: ["Beec", "Hibo", "Waqaf"],
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
          ref: "Person", // Agent = Person document (wakaalad/tasdiiq)
        },
      ],
      agentDocument: {
        docType: {
          type: String,
          enum: ["Wakaalad", "Tasdiiq"],
        },
        docRef: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "dhinac1.agentDocument.docType",
        },
      },
      // Per-agent documents mapping: agentId -> { wakaalad: ObjectId, tasdiiq: ObjectId }
      agentDocuments: {
        type: Map,
        of: new mongoose.Schema({
          wakaalad: { type: mongoose.Schema.Types.ObjectId, ref: 'Wakaalad' },
          tasdiiq: { type: mongoose.Schema.Types.ObjectId, ref: 'Tasdiiq' }
        }, { _id: false })
      },
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
          ref: "Person", // Agent = Person toos ah
        },
      ],
      guarantors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
        },
      ],
      agentDocuments: {
        type: Map,
        of: new mongoose.Schema({
          wakaalad: { type: mongoose.Schema.Types.ObjectId, ref: 'Wakaalad' },
          tasdiiq: { type: mongoose.Schema.Types.ObjectId, ref: 'Tasdiiq' }
        }, { _id: false })
      },
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

agreementSchema.pre("validate", function (next) {
  if (this.service === "Wareejin") {
    const allowed = ["Land", "Car", "Motor", "Share"];
    if (!allowed.includes(this.serviceType)) {
      return next(new Error("Invalid serviceType for Wareejin"));
    }
  }

  if (this.service === "Wakaalad") {
    const allowed = ["Wakaalad Guud", "Wakaalad Gaar"];
    if (!allowed.includes(this.serviceType)) {
      return next(new Error("Invalid serviceType for Wakaalad"));
    }
  }

  next();
});


export default mongoose.model("Agreement", agreementSchema);
