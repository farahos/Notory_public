import express from "express";
import {
  createTasdiiq,
  getAllTasdiiq,
  getTasdiiqById,
  updateTasdiiq,
  deleteTasdiiq,
} from "../controller/tasdiiqController.js";

const router = express.Router();

router.post("/", createTasdiiq);
router.get("/", getAllTasdiiq);
router.get("/:id", getTasdiiqById);
router.put("/:id", updateTasdiiq);
router.delete("/:id", deleteTasdiiq);

export default router;
