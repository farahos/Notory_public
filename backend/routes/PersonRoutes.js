import express from "express";
import {
  createPerson,
  getPersons,
  getPersonById,
  deletePerson,
  updatePerson,
  searchsuggestion,
} from "../controller/PersonController.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authenticate, getPersons);
router.get("/:id", authenticate, getPersonById);
router.post("/", authenticate, createPerson);
router.delete("/:id", authenticate, authorizeRoles("admin"), deletePerson);
router.put("/:id", authenticate, updatePerson);
router.get('/search', authenticate, searchsuggestion)

export default router;
