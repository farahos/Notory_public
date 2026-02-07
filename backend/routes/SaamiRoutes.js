import express from "express";
import {

  
  createSaami,
  getAllSaamis,
  getSaamiById,
  updateSaami,
  deleteSaami,
} from "../controller/Saamicontroller.js";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authenticate, createSaami);          // Create
router.get("/", getAllSaamis);           // Get all
router.get("/:id", getSaamiById);        // Get one
router.put("/:id", authenticate, updateSaami);         // Update
router.delete("/:id", authenticate, deleteSaami);      // Delete
export default router;
