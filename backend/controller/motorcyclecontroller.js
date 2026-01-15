import Motorcycle from "../model/Motor.js";
import Agreement from "../model/Agreement.js";

export const createMotorcycle = async (req, res) => {
  try {
    const { serviceId } = req.body;

    // 1. Hubi agreement
   

 

   

    // 4. Create
    const motorcycle = await Motorcycle.create(req.body);

    res.status(201).json(motorcycle);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};
export const getMotorcycles = async (req, res) => {
  try {
    const motorcycles = await Motorcycle.find()
     
      .sort({ createdAt: -1 });

    res.json(motorcycles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMotorcycleById = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findById(req.params.id)
    

    if (!motorcycle) {
      return res.status(404).json({ message: "Motorcycle not found" });
    }

    res.json(motorcycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateMotorcycle = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!motorcycle) {
      return res.status(404).json({ message: "Motorcycle not found" });
    }

    res.json(motorcycle);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};
export const deleteMotorcycle = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findByIdAndDelete(req.params.id);

    if (!motorcycle) {
      return res.status(404).json({ message: "Motorcycle not found" });
    }

    res.json({ message: "Motorcycle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

