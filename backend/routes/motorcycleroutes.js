import express from "express";
import {
  createMotorcycle,
  getMotorcycles,
  getMotorcycleById,
  deleteMotorcycle,
  updateMotorcycle,
} from "../controller/motorcyclecontroller.js";

const router = express.Router();

router.get("/", getMotorcycles);
router.get("/:id", getMotorcycleById);
router.post("/", createMotorcycle);
router.delete("/:id", deleteMotorcycle);
router.put("/:id", updateMotorcycle);

export default router;
