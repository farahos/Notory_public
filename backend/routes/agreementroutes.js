import express from "express";
import {
  addPersonToAgreement,
  createAgreement,
  deleteAgreement,
  getAgreementById,
  getAgreements,
  getNextRefNo,
  removePersonFromAgreement,
  setAgentDocument,
  updateAgreement,
} from "../controller/agreementcontroller.js";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authenticate ,createAgreement);

// Specific routes first
router.get("/next/refno", getNextRefNo);

// Then dynamic routes
router.get("/", getAgreements);
router.get("/:id", getAgreementById);

router.put("/:id", updateAgreement);
router.delete("/:id", deleteAgreement);

router.put("/:agreementId/add-person", addPersonToAgreement);
router.put("/:agreementId/remove-person", removePersonFromAgreement);
router.put("/:agreementId/agent-document", authenticate, setAgentDocument);

export default router;
