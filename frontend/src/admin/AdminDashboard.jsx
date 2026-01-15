import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const emptyForm = {
  fullName: "",
  motherName: "",
  birthPlace: "",
  birthYear: "",
  address: "",
  nationality: "Somali",
  phone: "",
  documentType: "",
  documentNumber: "",
};

const Persons = () => {
  const [persons, setPersons] = useState([]);

  // form & modal states
  const [form, setForm] = useState(emptyForm);
  const [showAddModal, setShowAddModal] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [showEditModal, setShowEditModal] = useState(false);

  // ================= FETCH =================
  const fetchPersons = async () => {
    try {
      const res = await axios.get("/api/persons");
      setPersons(res.data);
    } catch (err) {
      toast.error("Failed to fetch persons");
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  // ================= ADD =================
  const handleAddChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/persons", form);
      toast.success("Person added successfully");
      setForm(emptyForm);
      setShowAddModal(false);
      fetchPersons();
    } catch {
      toast.error("Failed to add person");
    }
  };

  // ================= DELETE =================
  const deletePerson = async (id) => {
    if (!window.confirm("Delete this person?")) return;
    try {
      await axios.delete(`/api/persons/${id}`);
      toast.success("Person deleted");
      fetchPersons();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ================= EDIT =================
  const openEditModal = (person) => {
    setEditId(person._id);
    setEditForm(person);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/persons/${editId}`, editForm);
      toast.success("Person updated successfully");
      setShowEditModal(false);
      fetchPersons();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Persons</h2>

      {/* Add Person Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Person
      </button>

      {/* ================= TABLE ================= */}
      <table className="w-full border bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Document</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((p) => (
            <tr key={p._id}>
              <td className="border p-2">{p.fullName}</td>
              <td className="border p-2">{p.phone}</td>
              <td className="border p-2">
                {p.documentType} - {p.documentNumber}
              </td>
              <td className="border p-2 text-center space-x-3">
                <button
                  onClick={() => openEditModal(p)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePerson(p._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ADD MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white p-6 rounded w-[600px] grid grid-cols-2 gap-3"
          >
            <h3 className="col-span-2 text-lg font-bold mb-2">Add Person</h3>

            <input name="fullName" value={form.fullName} onChange={handleAddChange} placeholder="Full Name" className="border p-2" required />
            <input name="motherName" value={form.motherName} onChange={handleAddChange} placeholder="Mother Name" className="border p-2" required />
            <input name="birthPlace" value={form.birthPlace} onChange={handleAddChange} placeholder="Birth Place" className="border p-2" required />
            <input name="birthYear" type="number" value={form.birthYear} onChange={handleAddChange} placeholder="Birth Year" className="border p-2" required />
            <input name="address" value={form.address} onChange={handleAddChange} placeholder="Address" className="border p-2" required />
            <input name="phone" value={form.phone} onChange={handleAddChange} placeholder="Phone" className="border p-2" required />
            <select name="documentType" value={form.documentType} onChange={handleAddChange} className="border p-2" required>
              <option value="">Document Type</option>
              <option value="Passport">Passport</option>
              <option value="ID Card">ID Card</option>
              <option value="Niira">Niira</option>
              <option value="Sugnan">Sugnan</option>
              <option value="Laysin">Laysin</option>
            </select>
            <input name="documentNumber" value={form.documentNumber} onChange={handleAddChange} placeholder="Document Number" className="border p-2" required />
            <input name="nationality" value={form.nationality} onChange={handleAddChange} placeholder="Nationality" className="border p-2" />

            <div className="col-span-2 flex justify-end gap-3 mt-3">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white p-6 rounded w-[600px] grid grid-cols-2 gap-3"
          >
            <h3 className="col-span-2 text-lg font-bold mb-2">Edit Person</h3>

            <input name="fullName" value={editForm.fullName} onChange={handleEditChange} placeholder="Full Name" className="border p-2" required />
            <input name="motherName" value={editForm.motherName} onChange={handleEditChange} placeholder="Mother Name" className="border p-2" required />
            <input name="birthPlace" value={editForm.birthPlace} onChange={handleEditChange} placeholder="Birth Place" className="border p-2" required />
            <input name="birthYear" type="number" value={editForm.birthYear} onChange={handleEditChange} placeholder="Birth Year" className="border p-2" required />
            <input name="address" value={editForm.address} onChange={handleEditChange} placeholder="Address" className="border p-2" required />
            <input name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="Phone" className="border p-2" required />
            <select name="documentType" value={editForm.documentType} onChange={handleEditChange} className="border p-2" required>
              <option value="Passport">Passport</option>
              <option value="ID Card">ID Card</option>
              <option value="Niira">Niira</option>
              <option value="Sugnan">Sugnan</option>
              <option value="Laysin">Laysin</option>
            </select>
            <input name="documentNumber" value={editForm.documentNumber} onChange={handleEditChange} placeholder="Document Number" className="border p-2" required />
            <input name="nationality" value={editForm.nationality} onChange={handleEditChange} placeholder="Nationality" className="border p-2" />

            <div className="col-span-2 flex justify-end gap-3 mt-3">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Persons;
