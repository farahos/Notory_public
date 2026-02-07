import Saami from "../model/Saami.js";

// ➕ Create new Saami
export const createSaami = async (req, res) => {
  try {
    const saami = new Saami(req.body); // ✅
    await saami.save();
    res.status(201).json(saami);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📄 Get all Saamis
export const getAllSaamis = async (req, res) => {
  try {
    const saamis = await Saami.find().sort({ createdAt: -1 }); // ✅
    res.status(200).json(saamis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get single Saami by ID
export const getSaamiById = async (req, res) => {
  try {
    const saami = await Saami.findById(req.params.id); // ✅
    if (!saami) {
      return res.status(404).json({ message: "Saami not found" });
    }
    res.status(200).json(saami);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Saami
export const updateSaami = async (req, res) => {
  try {
    const saami = await Saami.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!saami) {
      return res.status(404).json({ message: "Saami not found" });
    }
    res.status(200).json(saami);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🗑️ Delete Saami
export const deleteSaami = async (req, res) => {
  try {
    const saami = await Saami.findByIdAndDelete(req.params.id);
    if (!saami) {
      return res.status(404).json({ message: "Saami not found" });
    }
    res.status(200).json({ message: "Saami deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
