import express from "express";
import {
  createMootocycle,
  getMootocycles,
  getMootocycleById,
  deleteMootocycle,
  updateMootocycle,
} from "../controller/Mootocontroller.js.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authenticate, getMootocycles);
router.get("/:id", authenticate, getMootocycleById);
router.post("/", authenticate, createMootocycle);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteMootocycle);
router.put("/:id", authenticate, updateMootocycle);

export default router;
