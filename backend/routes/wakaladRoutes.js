import express from "express";
import {
  createWakaalad,
  getAllWakaalad,
  getWakaaladById,
  updateWakaalad,
  deleteWakaalad,
} from "../controller/wakaladController.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

// CREATE
router.post("/", authenticate, createWakaalad);

// GET ALL
router.get("/", getAllWakaalad);

// GET BY ID
router.get("/:id", getWakaaladById);

// UPDATE
router.put("/:id", authenticate, updateWakaalad);

// DELETE
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteWakaalad);

export default router;
