import Share from "../model/Share.js";

// ➕ Create new share
export const createShare = async (req, res) => {
  try {
    const share = new Share(req.body);
    await share.save();
    res.status(201).json(share);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📄 Get all shares
export const getAllShares = async (req, res) => {
  try {
    const shares = await Share.find().sort({ createdAt: -1 });
    res.status(200).json(shares);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get single share by ID
export const getShareById = async (req, res) => {
  try {
    const share = await Share.findById(req.params.id);
    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update share
export const updateShare = async (req, res) => {
  try {
    const share = await Share.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }
    res.status(200).json(share);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🗑️ Delete share
export const deleteShare = async (req, res) => {
  try {
    const share = await Share.findByIdAndDelete(req.params.id);
    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }
    res.status(200).json({ message: "Share deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
