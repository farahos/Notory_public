import Mootocycle from "../model/Mooto.js";
import Agreement from "../model/Agreement.js";

// ➕ Create
export const createMootocycle = async (req, res) => {
  try {
    const mootocycle = await Mootocycle.create(req.body); // ✅
    res.status(201).json(mootocycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get all
export const getMootocycles = async (req, res) => {
  try {
    const mootocycles = await Mootocycle.find()
      .sort({ createdAt: -1 });

    res.json(mootocycles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get one by ID
export const getMootocycleById = async (req, res) => {
  try {
    const mootocycle = await Mootocycle.findById(req.params.id);

    if (!mootocycle) {
      return res.status(404).json({ message: "Mootocycle not found" });
    }

    res.json(mootocycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update
export const updateMootocycle = async (req, res) => {
  try {
    const mootocycle = await Mootocycle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!mootocycle) {
      return res.status(404).json({ message: "Mootocycle not found" });
    }

    res.json(mootocycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete
export const deleteMootocycle = async (req, res) => {
  try {
    const mootocycle = await Mootocycle.findByIdAndDelete(req.params.id);

    if (!mootocycle) {
      return res.status(404).json({ message: "Mootocycle not found" });
    }

    res.json({ message: "Mootocycle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
