import express from "express";
import {
  createTasdiiq,
  getAllTasdiiq,
  getTasdiiqById,
  updateTasdiiq,
  deleteTasdiiq,
} from "../controller/tasdiiqController.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authenticate, createTasdiiq);
router.get("/", authenticate, getAllTasdiiq);
router.get("/:id", authenticate, getTasdiiqById);
router.put("/:id", authenticate, updateTasdiiq);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteTasdiiq);

export default router;
