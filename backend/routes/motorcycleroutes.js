import express from "express";
import {
  createMotorcycle,
  getMotorcycles,
  getMotorcycleById,
  deleteMotorcycle,
  updateMotorcycle,
} from "../controller/motorcyclecontroller.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authenticate, getMotorcycles);
router.get("/:id", authenticate, getMotorcycleById);
router.post("/", authenticate, createMotorcycle);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteMotorcycle);
router.put("/:id", authenticate, updateMotorcycle);

export default router;
