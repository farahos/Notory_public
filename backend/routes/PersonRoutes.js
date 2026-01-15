import express from "express";
import {
  createPerson,
  getPersons,
  getPersonById,
  deletePerson,
  updatePerson,
  searchsuggestion,
} from "../controller/PersonController.js";

const router = express.Router();

router.get("/", getPersons);
router.get("/:id", getPersonById);
router.post("/", createPerson);
router.delete("/:id", deletePerson);
router.put("/:id", updatePerson);
router.get('/search', searchsuggestion)

export default router;
