import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Agreement = () => {
  const [persons, setPersons] = useState([]);
  const [refNo, setRefNo] = useState("");
  const navigate = useNavigate();
  const serviceTypeOptions = {
    Wareejin: ["Mooto", "Car", "Land", "Saami"],
    Wakaalad: ["Wakaalad Guud", "Wakaalad Gaar"],
    Daamaanad : ["Daaminul maal", "Shaqaaleysiin"],
    Cedeyn : ["Cadeyn Lacageed", "Cadeyn"],
    Rahan : ["Xayiraad Saami", "Rahmaad"],
    Heshiishyo  : ["Aas aasid shirkad ", "Kiro"],
  };

  const [form, setForm] = useState({
    agreementDate: new Date().toISOString().split("T")[0],
    service: "Wareejin",
    serviceType: "Mooto",
    agreementType: "Beec",
    officeFee: "",
    sellingPrice: "",
    dhinac1: { sellers: [], agents: [], guarantors: [] },
    dhinac2: { buyers: [], agents: [], guarantors: [] },
  });

  const [searchInputs, setSearchInputs] = useState({
    dhinac1: { sellers: "", agents: "", guarantors: "" },
    dhinac2: { buyers: "", agents: "", guarantors: "" }
  });

  const [newPersonModal, setNewPersonModal] = useState({
    show: false,
    side: "",
    role: "",
    fullName: "",
    phone: "",
    forSide: "", // dhinac1 or dhinac2
    forRole: "" // sellers, buyers, agents, guarantors
  });

  useEffect(() => {
    fetchPersons();
    axios.get("/api/agreements/next/refno").then(res => setRefNo(res.data.refNo));
  }, []);

  const fetchPersons = () => {
    axios.get("/api/persons").then(res => setPersons(res.data));
  };

  useEffect(() => {
    if (form.agreementType !== "BEEC") {
      setForm(prev => ({ ...prev, sellingPrice: "" }));
    }
  }, [form.agreementType]);

  useEffect(() => {
  const firstType = serviceTypeOptions[form.service][0];
  setForm(prev => ({
    ...prev,
    serviceType: firstType,
  }));
}, [form.service]);


  useEffect(() => {
    if (form.service !== "Wareejin") {
      setForm(prev => ({
        ...prev,
        agreementType: "",
        sellingPrice: "",
      }));
    } else {
      setForm(prev => ({
        ...prev,
        agreementType: "Beec",
      }));
    }
  }, [form.service]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearchChange = (side, role, value) => {
    setSearchInputs(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [role]: value
      }
    }));
  };

  const handleSelect = (side, role, personId) => {
    if (!personId) return;
    
    setForm(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [role]: [...new Set([...prev[side][role], personId])],
      },
    }));
    
    // Clear search input
    handleSearchChange(side, role, "");
  };

  const handleRemove = (side, role, id) => {
    setForm(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [role]: prev[side][role].filter(p => p !== id),
      },
    }));
  };

  const openNewPersonModal = (side, role) => {
    setNewPersonModal({
      show: true,
      side: side,
      role: role,
      fullName: searchInputs[side][role],
      phone: "",
      forSide: side,
      forRole: role
    });
  };

  const closeNewPersonModal = () => {
    setNewPersonModal({
      show: false,
      side: "",
      role: "",
      fullName: "",
      phone: "",
      forSide: "",
      forRole: ""
    });
  };

  const createNewPerson = async () => {
    if (!newPersonModal.fullName.trim() || !newPersonModal.phone.trim()) {
      toast.error("Please enter both name and phone");
      return;
    }

    try {
      const res = await axios.post("/api/persons", {
        fullName: newPersonModal.fullName,
        phone: newPersonModal.phone
      });
      
      toast.success("Person created successfully");
      
      // Add new person to the form
      handleSelect(newPersonModal.forSide, newPersonModal.forRole, res.data._id);
      
      // Refresh persons list
      fetchPersons();
      
      // Close modal
      closeNewPersonModal();
    } catch (err) {
      toast.error("Error creating person");
    }
  };

  const filteredPersons = (side, role) => {
    const searchTerm = searchInputs[side][role].toLowerCase();
    if (!searchTerm) return persons;
    
    return persons.filter(person => 
      person.fullName.toLowerCase().includes(searchTerm) ||
      person.phone?.toLowerCase().includes(searchTerm)
    );
  };
  const serviceConfig = {
  Wareejin: {
    side1Title: "Dhinaca 1aad (Iska Iibiye)",
    side2Title: "Dhinaca 2aad (Iibsade)",
    dhinac1Roles: {
      sellers: "Iska Iibiye",
      agents: "Wakiil",
      guarantors: "Damiin"
    },
    dhinac2Roles: {
      buyers: "Iibsade",
      agents: "Wakiil",
      guarantors: "Damiin"
    }
  },

  Wakaalad: {
    side1Title: "Dhinaca 1aad (Wakaalad Bixiye)",
    side2Title: "Dhinaca 2aad (La-wakiishe)",
    dhinac1Roles: {
      sellers: "Wakaalad Bixiye",
      agents: "Wakiil",
      guarantors: "Damiin"
    },
    dhinac2Roles: {
      buyers: "La-wakiishe",
      agents: "Wakiil",
      guarantors: "Damiin"
    }
  },

  Daamaanad: {
    side1Title: "Dhinaca 1aad (Damiinu-l-Maal)",
    side2Title: "Dhinaca 2aad (La Damiinte)",
    dhinac1Roles: {
      sellers: "Damiinu-l-Maal",
      agents: "Wakiil",
      guarantors: "Damiin"
    },
    dhinac2Roles: {
      buyers: "La Damiinte",
      agents: "Wakiil",
      guarantors: "Damiin"
    }
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    if (payload.service !== "Wareejin") {
      delete payload.agreementType;
      delete payload.sellingPrice;
    }

    try {
      const res = await axios.post("/api/agreements", payload);
      toast.success("Agreement saved");
      navigate(`/agreement/${res.data._id}`);
    } catch (err) {
      toast.error("Error saving agreement");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Agreement Registration</h2>

      {/* New Person Modal */}
      {newPersonModal.show && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Create New Person</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={newPersonModal.fullName}
                  onChange={(e) => setNewPersonModal(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full border rounded p-2"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPersonModal.phone}
                  onChange={(e) => setNewPersonModal(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border rounded p-2"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeNewPersonModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createNewPerson}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create & Add
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ===== TOP INFO ===== */}
        <div className="flex gap-6">
          <div className="flex-1 bg-white p-4 rounded shadow space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={form.agreementDate}
                name="agreementDate"
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ref No</label>
              <input
                type="text"
                value={refNo}
                readOnly
                className="border p-2 rounded w-full bg-gray-50"
              />
            </div>
          </div>

          <div className="flex-1 bg-white p-4 rounded shadow space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="Wareejin">Wareejin</option>
                <option value="Wakaalad">Wakaalad</option>
                <option value="Daamaanad">Daamaanad</option>
                
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Service Type</label>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              >
                
                {serviceTypeOptions[form.service]?.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Objective</label>
                <input
                  type="text"
                  name="sellingPrice"
                  value={` Hashiis ${form.serviceType}`}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
          </div>

          <div className="flex-1 bg-white p-4 rounded shadow space-y-4">
            {form.service === "Wareejin" && (
              <div>
                <label className="block text-sm font-medium mb-1">Agreement Type</label>
                <select
                  name="agreementType"
                  value={form.agreementType}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="Beec">Beec</option>
                  <option value="Hibo">Hibo</option>
                  <option value="Waqaf">Waqaf</option>
                </select>
              </div>
            )}

            {form.service === "Wareejin" && form.agreementType === "Beec" && (
              <div>
                <label className="block text-sm font-medium mb-1">Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Office Fee</label>
              <input
                type="number"
                name="officeFee"
                value={form.officeFee}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        </div>

        {/* ===== SIDES ===== */}
        <div className="flex gap-6">
          {/* DHINAC 1 */}
          <div className="flex-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Dhinaca 1aad </h3>

            {["sellers", "agents", "guarantors"].map(role => (
              <div key={role} className="mb-4">
                
                <label className="block text-sm font-medium mb-1">
                  {serviceConfig[form.service].dhinac1Roles[role]}
                </label>
                
                {/* Search Input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={searchInputs.dhinac1[role]}
                    onChange={(e) => handleSearchChange("dhinac1", role, e.target.value)}
                    className="flex-1 border p-2 rounded"
                  placeholder={`${serviceConfig[form.service].dhinac1Roles[role]} `}

                  />
                  <button
                    type="button"
                    onClick={() => openNewPersonModal("dhinac1", role)}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    New
                  </button>
                </div>

                {/* Search Results */}
                {searchInputs.dhinac1[role] && (
                  <div className="border rounded max-h-40 overflow-y-auto mb-2">
                    {filteredPersons("dhinac1", role).map(person => (
                      <div
                        key={person._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSelect("dhinac1", role, person._id)}
                      >
                        <div className="font-medium">{person.fullName}</div>
                        <div className="text-sm text-gray-600">{person.phone}</div>
                      </div>
                    ))}
                    {filteredPersons("dhinac1", role).length === 0 && (
                      <div className="p-3 text-center text-gray-500">
                        No persons found
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Persons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.dhinac1[role].map(id => {
                    const person = persons.find(p => p._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-blue-100 px-3 py-1 rounded text-sm flex items-center gap-2"
                      >
                        <span>{person?.fullName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove("dhinac1", role, id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* DHINAC 2 */}
          <div className="flex-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Dhinaca 2aad </h3>

            {["buyers", "agents", "guarantors"].map(role => (
              <div key={role} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {serviceConfig[form.service].dhinac2Roles[role]}
              </label>
                              
                {/* Search Input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={searchInputs.dhinac2[role]}
                    onChange={(e) => handleSearchChange("dhinac2", role, e.target.value)}
                    className="flex-1 border p-2 rounded"
                    placeholder={`${serviceConfig[form.service].dhinac2Roles[role]}`}

                  />
                  <button
                    type="button"
                    onClick={() => openNewPersonModal("dhinac2", role)}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    New
                  </button>
                </div>

                {/* Search Results */}
                {searchInputs.dhinac2[role] && (
                  <div className="border rounded max-h-40 overflow-y-auto mb-2">
                    {filteredPersons("dhinac2", role).map(person => (
                      <div
                        key={person._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSelect("dhinac2", role, person._id)}
                      >
                        <div className="font-medium">{person.fullName}</div>
                        <div className="text-sm text-gray-600">{person.phone}</div>
                      </div>
                    ))}
                    {filteredPersons("dhinac2", role).length === 0 && (
                      <div className="p-3 text-center text-gray-500">
                        No persons found
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Persons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.dhinac2[role].map(id => {
                    const person = persons.find(p => p._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-green-100 px-3 py-1 rounded text-sm flex items-center gap-2"
                      >
                        <span>{person?.fullName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove("dhinac2", role, id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SAVE ===== */}
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-amber-700 text-white px-6 py-2 rounded hover:bg-amber-800"
          >
            Save Agreement
          </button>
        </div>

      </form>
    </div>
  );
};

export default Agreement;