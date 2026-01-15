import express from "express";
import {
  createShare,
  getAllShares,
  getShareById,
  updateShare,
  deleteShare,
} from "../controller/sharecontroller.js";

const router = express.Router();

router.post("/", createShare);          // Create
router.get("/", getAllShares);           // Get all
router.get("/:id", getShareById);        // Get one
router.put("/:id", updateShare);         // Update
router.delete("/:id", deleteShare);      // Delete

export default router;
