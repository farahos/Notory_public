import Wakaalad from "../model/Wakaalad.js";

/* ===============================
   CREATE WAKAALAD
================================ */
export const createWakaalad = async (req, res) => {
  try {
    const wakaalad = await Wakaalad.create(req.body);
    res.status(201).json(wakaalad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL WAKAALAD
================================ */
export const getAllWakaalad = async (req, res) => {
  try {
    const wakaaladList = await Wakaalad.find().sort({ date: -1 });
    res.json(wakaaladList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET WAKAALAD BY ID
================================ */
export const getWakaaladById = async (req, res) => {
  try {
    const wakaalad = await Wakaalad.findById(req.params.id);
    if (!wakaalad) return res.status(404).json({ message: "Wakaalad not found" });
    res.json(wakaalad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   UPDATE WAKAALAD
================================ */
export const updateWakaalad = async (req, res) => {
  try {
    const wakaalad = await Wakaalad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!wakaalad) return res.status(404).json({ message: "Wakaalad not found" });
    res.json(wakaalad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   DELETE WAKAALAD
================================ */
export const deleteWakaalad = async (req, res) => {
  try {
    const wakaalad = await Wakaalad.findByIdAndDelete(req.params.id);
    if (!wakaalad) return res.status(404).json({ message: "Wakaalad not found" });
    res.json({ message: "Wakaalad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
