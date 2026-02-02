import Agreement from "../model/Agreement.js";
import mongoose from "mongoose";
import Wakaalad from "../model/Wakaalad.js";
import Tasdiiq from "../model/Tasdiiq.js";

/* ===============================
   HELPER: GENERATE REF NO
   Format: 001/BQL/2026
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
   GET AGREEMENT BY ID - SIMPLIFY POPULATE
================================ */
export const getAgreementById = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id)
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors")
      .populate("createdBy", "username");

    // Populate per-agent documents (agentDocuments map)
    if (agreement) {
      const populateAgentDocs = async (side) => {
        const map = agreement[side]?.agentDocuments;
        if (!map) return;
        // convert Map to plain object
        const entries = map instanceof Map ? Object.fromEntries(map) : map;
        for (const [agentId, docs] of Object.entries(entries)) {
          if (docs?.wakaalad) {
            try {
              const waka = await Wakaalad.findById(docs.wakaalad);
              entries[agentId].wakaalad = waka || docs.wakaalad;
            } catch (e) {
              console.error('Failed to populate wakaalad for agent', agentId, e);
            }
          }
          if (docs?.tasdiiq) {
            try {
              const tas = await Tasdiiq.findById(docs.tasdiiq);
              entries[agentId].tasdiiq = tas || docs.tasdiiq;
            } catch (e) {
              console.error('Failed to populate tasdiiq for agent', agentId, e);
            }
          }
        }
        agreement[side].agentDocuments = entries;
      };

      await populateAgentDocs('dhinac1');
      await populateAgentDocs('dhinac2');
    }

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error getting agreement:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL AGREEMENTS - SIMPLIFY POPULATE
================================ */
export const getAgreements = async (req, res) => {
  try {
    const agreements = await Agreement.find()
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors")
      .populate("createdBy", "username");

    // Populate per-agent documents for each agreement
    for (let agreement of agreements) {
      const populateAgentDocs = async (side) => {
        const map = agreement[side]?.agentDocuments;
        if (!map) return;
        const entries = map instanceof Map ? Object.fromEntries(map) : map;
        for (const [agentId, docs] of Object.entries(entries)) {
          if (docs?.wakaalad) {
            try {
              const waka = await Wakaalad.findById(docs.wakaalad);
              entries[agentId].wakaalad = waka || docs.wakaalad;
            } catch (e) {
              console.error('Failed to populate wakaalad for agent', agentId, e);
            }
          }
          if (docs?.tasdiiq) {
            try {
              const tas = await Tasdiiq.findById(docs.tasdiiq);
              entries[agentId].tasdiiq = tas || docs.tasdiiq;
            } catch (e) {
              console.error('Failed to populate tasdiiq for agent', agentId, e);
            }
          }
        }
        agreement[side].agentDocuments = entries;
      };

      await populateAgentDocs('dhinac1');
      await populateAgentDocs('dhinac2');
    }

    res.json(agreements);
  } catch (error) {
    console.error("Error getting agreements:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   UPDATE AGREEMENT - SIMPLIFY POPULATE
================================ */
export const updateAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    // Populate per-agent documents (agentDocuments map)
    if (agreement) {
      const populateAgentDocs = async (side) => {
        const map = agreement[side]?.agentDocuments;
        if (!map) return;
        const entries = map instanceof Map ? Object.fromEntries(map) : map;
        for (const [agentId, docs] of Object.entries(entries)) {
          if (docs?.wakaalad) {
            try {
              const waka = await Wakaalad.findById(docs.wakaalad);
              entries[agentId].wakaalad = waka || docs.wakaalad;
            } catch (e) {
              console.error('Failed to populate wakaalad for agent', agentId, e);
            }
          }
          if (docs?.tasdiiq) {
            try {
              const tas = await Tasdiiq.findById(docs.tasdiiq);
              entries[agentId].tasdiiq = tas || docs.tasdiiq;
            } catch (e) {
              console.error('Failed to populate tasdiiq for agent', agentId, e);
            }
          }
        }
        agreement[side].agentDocuments = entries;
      };

      await populateAgentDocs('dhinac1');
      await populateAgentDocs('dhinac2');
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error updating agreement:", error);
    res.status(500).json({ message: error.message });
  }
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
      createdBy: req.user._id,
    });

    // Populate after creation
    const populatedAgreement = await Agreement.findById(agreement._id)
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors")
      .populate("createdBy", "username");

    // populate any agentDocuments on the created agreement
    if (populatedAgreement) {
      const populateAgentDocs = async (side) => {
        const map = populatedAgreement[side]?.agentDocuments;
        if (!map) return;
        const entries = map instanceof Map ? Object.fromEntries(map) : map;
        for (const [agentId, docs] of Object.entries(entries)) {
          if (docs?.wakaalad) {
            try {
              const waka = await Wakaalad.findById(docs.wakaalad);
              entries[agentId].wakaalad = waka || docs.wakaalad;
            } catch (e) {
              console.error('Failed to populate wakaalad for agent', agentId, e);
            }
          }
          if (docs?.tasdiiq) {
            try {
              const tas = await Tasdiiq.findById(docs.tasdiiq);
              entries[agentId].tasdiiq = tas || docs.tasdiiq;
            } catch (e) {
              console.error('Failed to populate tasdiiq for agent', agentId, e);
            }
          }
        }
        populatedAgreement[side].agentDocuments = entries;
      };

      await populateAgentDocs('dhinac1');
      await populateAgentDocs('dhinac2');
    }

    res.status(201).json(populatedAgreement);
  } catch (error) {
    console.error("Error creating agreement:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate refNo" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   ADD PERSON (SELLER / BUYER / AGENT / GUARANTOR)
===================================================== */
export const addPersonToAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { side, role, personId } = req.body;

    console.log("Adding person:", { agreementId, side, role, personId });

    if (!["dhinac1", "dhinac2"].includes(side)) {
      return res.status(400).json({ message: "Invalid side" });
    }

    // Validate personId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(personId)) {
      return res.status(400).json({ message: "Invalid person ID" });
    }

    const allowedRoles =
      side === "dhinac1"
        ? ["sellers", "agents"]
        : ["buyers", "agents", "guarantors"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { $addToSet: { [`${side}.${role}`]: personId } },
      { new: true }
    )
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    // Populate any per-agent agentDocuments map entries
    const populateAgentDocs = async (side) => {
      const map = agreement[side]?.agentDocuments;
      if (!map) return;
      const entries = map instanceof Map ? Object.fromEntries(map) : map;
      for (const [agentId, docs] of Object.entries(entries)) {
        if (docs?.wakaalad) {
          try {
            const waka = await Wakaalad.findById(docs.wakaalad);
            entries[agentId].wakaalad = waka || docs.wakaalad;
          } catch (e) {
            console.error('Failed to populate wakaalad for agent', agentId, e);
          }
        }
        if (docs?.tasdiiq) {
          try {
            const tas = await Tasdiiq.findById(docs.tasdiiq);
            entries[agentId].tasdiiq = tas || docs.tasdiiq;
          } catch (e) {
            console.error('Failed to populate tasdiiq for agent', agentId, e);
          }
        }
      }
      agreement[side].agentDocuments = entries;
    };

    await populateAgentDocs('dhinac1');
    await populateAgentDocs('dhinac2');

    res.json(agreement);
  } catch (error) {
    console.error("Error adding person:", error);
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

    console.log("Removing person:", { agreementId, side, role, personId });

    if (!mongoose.Types.ObjectId.isValid(personId)) {
      return res.status(400).json({ message: "Invalid person ID" });
    }

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { $pull: { [`${side}.${role}`]: personId } },
      { new: true }
    )
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    // Handle agentDocument populate separately
    if (agreement.dhinac1?.agentDocument?.docRef) {
      const docType = agreement.dhinac1.agentDocument.docType;
      
      if (docType === "Wakaalad") {
        await agreement.populate({
          path: "dhinac1.agentDocument.docRef",
          model: "Wakaalad"
        });
      } else if (docType === "Tasdiiq") {
        await agreement.populate({
          path: "dhinac1.agentDocument.docRef",
          model: "Tasdiiq"
        });
      }
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error removing person:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   SET AGENT DOCUMENT (Wakaalad / Tasdiiq)
===================================================== */
export const setAgentDocument = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { docType, docRef } = req.body;

    console.log("Setting agent document:", { agreementId, docType, docRef });

    if (!["Wakaalad", "Tasdiiq"].includes(docType)) {
      return res.status(400).json({ message: "Invalid docType" });
    }

    if (!mongoose.Types.ObjectId.isValid(docRef)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const agreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { "dhinac1.agentDocument": { docType, docRef } },
      { new: true }
    )
      .populate("dhinac1.sellers")
      .populate("dhinac1.agents")
      .populate("dhinac2.buyers")
      .populate("dhinac2.agents")
      .populate("dhinac2.guarantors");

    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    // Populate the document based on its type
    if (docType === "Wakaalad") {
      await agreement.populate({
        path: "dhinac1.agentDocument.docRef",
        model: "Wakaalad"
      });
    } else if (docType === "Tasdiiq") {
      await agreement.populate({
        path: "dhinac1.agentDocument.docRef",
        model: "Tasdiiq"
      });
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error setting agent document:", error);
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
    console.error("Error deleting agreement:", error);
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
    console.error("Error getting next ref no:", error);
    res.status(500).json({ message: error.message });
  }
};