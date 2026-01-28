import express from "express";
import {
  createShare,
  getAllShares,
  getShareById,
  updateShare,
  deleteShare,
} from "../controller/sharecontroller.js";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authenticate, createShare);          // Create
router.get("/", getAllShares);           // Get all
router.get("/:id", getShareById);        // Get one
router.put("/:id", authenticate, updateShare);         // Update
router.delete("/:id", authenticate, deleteShare);      // Delete
export default router;
