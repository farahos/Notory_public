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
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authenticate ,createAgreement);

// Specific routes first
router.get("/next/refno", getNextRefNo);

// Then dynamic routes
router.get("/", authenticate, getAgreements);
router.get("/:id", authenticate, getAgreementById);

router.put("/:id", authenticate, updateAgreement);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteAgreement);

router.put("/:agreementId/add-person", authenticate, addPersonToAgreement);
router.put("/:agreementId/remove-person", authenticate, removePersonFromAgreement);
router.put("/:agreementId/agent-document", authenticate, setAgentDocument);

export default router;
