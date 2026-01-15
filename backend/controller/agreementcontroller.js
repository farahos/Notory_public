import Agreement from "../model/Agreement.js";

/* ===============================
   HELPER: GENERATE REF NO
   001/BQL/2026
================================ */
const generateRefNo = async () => {
  const year = new Date().getFullYear();

  const lastAgreement = await Agreement.findOne({
    refNo: new RegExp(`/${year}$`),
  }).sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastAgreement) {
    const lastNum = parseInt(lastAgreement.refNo.split("/")[0]);
    nextNumber = lastNum + 1;
  }

  return `${String(nextNumber).padStart(3, "0")}/BQL/${year}`;
};

/* ===============================
   CREATE AGREEMENT
================================ */
export const createAgreement = async (req, res) => {
  try {
    const refNo = await generateRefNo();

    const agreement = await Agreement.create({
      ...req.body,
      refNo,
        createdBy: req.user._id, // ⭐ MUHIIM
    });

    res.status(201).json(agreement);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate refNo" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL AGREEMENTS
================================ */
export const getAgreements = async (req, res) => {
  try {
    const agreements = await Agreement.find()
      .populate("dhinac1.sellers dhinac1.agents dhinac1.guarantors")
      .populate("dhinac2.buyers dhinac2.agents dhinac2.guarantors")
      .populate("createdBy" ,"username");

    res.json(agreements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   GET AGREEMENT BY ID
================================ */
export const getAgreementById = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id)
      .populate("dhinac1.sellers dhinac1.agents dhinac1.guarantors")
      .populate("dhinac2.buyers dhinac2.agents dhinac2.guarantors")
      .populate("createdBy", "username");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json(agreement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   UPDATE AGREEMENT
================================ */
export const updateAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json(agreement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   DELETE AGREEMENT
================================ */
export const deleteAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndDelete(req.params.id);

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json({ message: "Agreement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET NEXT REF NO
================================ */
export const getNextRefNo = async (req, res) => {
  try {
    const refNo = await generateRefNo();
    res.json({ refNo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   ADD PERSON (SELLER / BUYER / AGENT / GUARANTOR)
   side: dhinac1 | dhinac2
   role: sellers | buyers | agents | guarantors
===================================================== */
export const addPersonToAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { side, role, personId } = req.body;

    if (!["dhinac1", "dhinac2"].includes(side)) {
      return res.status(400).json({ message: "Invalid side" });
    }

    const allowedRoles =
      side === "dhinac1"
        ? ["sellers", "agents", "guarantors"]
        : ["buyers", "agents", "guarantors"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      {
        $addToSet: {
          [`${side}.${role}`]: personId, // duplicate ma galayo
        },
      },
      { new: true }
    )
      .populate("dhinac1.sellers dhinac1.agents dhinac1.guarantors")
      .populate("dhinac2.buyers dhinac2.agents dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json(agreement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   REMOVE PERSON
===================================================== */
export const removePersonFromAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { side, role, personId } = req.body;

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      {
        $pull: {
          [`${side}.${role}`]: personId,
        },
      },
      { new: true }
    )
      .populate("dhinac1.sellers dhinac1.agents dhinac1.guarantors")
      .populate("dhinac2.buyers dhinac2.agents dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json(agreement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
