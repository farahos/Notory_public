import Person from "../model/Person.js";

// CREATE person
export const createPerson = async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all persons
export const getPersons = async (req, res) => {
  try {
    const persons = await Person.find().sort({ createdAt: -1 });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single person
export const getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE person
export const deletePerson = async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: "Person deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update person controller would go here
export const updatePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(person);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ SEARCH PERSONS
export const searchsuggestion = async (req, res) => {
  try {
    const { q } = req.query;
    const persons = await Person.find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}