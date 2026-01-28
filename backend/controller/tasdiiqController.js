import Tasdiiq from "../model/Tasdiiq.js";

// CREATE
export const createTasdiiq = async (req, res) => {
  try {
    const { refNo, date, kasooBaxday } = req.body;

    const tasdiiq = await Tasdiiq.create({
      refNo,
      date,
      kasooBaxday,
    });

    res.status(201).json(tasdiiq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL
export const getAllTasdiiq = async (req, res) => {
  try {
    const tasdiiq = await Tasdiiq.find().sort({ createdAt: -1 });
    res.json(tasdiiq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getTasdiiqById = async (req, res) => {
  try {
    const tasdiiq = await Tasdiiq.findById(req.params.id);

    if (!tasdiiq) {
      return res.status(404).json({ message: "Tasdiiq lama helin" });
    }

    res.json(tasdiiq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
export const updateTasdiiq = async (req, res) => {
  try {
    const tasdiiq = await Tasdiiq.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tasdiiq) {
      return res.status(404).json({ message: "Tasdiiq lama helin" });
    }

    res.json(tasdiiq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteTasdiiq = async (req, res) => {
  try {
    const tasdiiq = await Tasdiiq.findByIdAndDelete(req.params.id);

    if (!tasdiiq) {
      return res.status(404).json({ message: "Tasdiiq lama helin" });
    }

    res.json({ message: "Tasdiiq waa la tirtiray" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
