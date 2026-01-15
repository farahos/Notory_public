import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Agreement = () => {
  const [persons, setPersons] = useState([]);
  const [refNo, setRefNo] = useState("");
  const navigate = useNavigate();



  const [form, setForm] = useState({
    agreementDate: new Date().toISOString().split("T")[0], // TAARIJKHDA MAANTA
   
    serviceType: "Motor",
    agreementType : "Beec" ,
    officeFee: "",
    sellingPrice: "",
    dhinac1: { sellers: [], agents: [], guarantors: [] },
    dhinac2: { buyers: [], agents: [], guarantors: [] },
  });

  useEffect(() => {
    axios.get("/api/persons").then(res => setPersons(res.data));
    axios.get("/api/agreements/next/refno").then(res => setRefNo(res.data.refNo));
  }, []);
useEffect(() => {
  if (form.agreementType !== "BEEC") {
    setForm(prev => ({ ...prev, sellingPrice: "" }));
  }
}, [form.agreementType]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelect = (side, role, value) => {
    if (!value) return;
    setForm(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [role]: [...new Set([...prev[side][role], value])],
      },
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/agreements", form);
      toast.success("Agreement saved");
      navigate(`/agreement/${res.data._id}`);
    } catch {
      toast.error("Error saving agreement");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Agreement Registration</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ===== TOP INFO ===== */}
       <div className="flex gap-6">
         <div className="flex-1 bg-white p-4 rounded shadow">
          <div className="">
            <label className="text-sm">Date</label>
            <input
              type="date"
              value={form.agreementDate}
              name="agreementDate"
              onChange={handleChange}
             className="border p-2 rounded w-full"

              required
            />
          </div>

          <div className="">
            <label className="text-sm">Ref No</label>
            <input
              type="text"
              value={refNo}
              readOnly
              className="border p-2 rounded w-full"

            />
         

          <div className="">
            <label className="text-sm">Service Type</label>
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
             className="border p-2 rounded w-full"

            >
              <option>Motor</option>
              <option>Car</option>
              <option>Land</option>
              <option>Share</option>
            </select>
          </div>

         
        </div>
        </div>
          <div className="flex-1 bg-white p-4 rounded shadow">
         <div className="">
            <label className="text-sm">Service Type</label>
            <select
              name="agreementType"
              value={form.agreementType}
              onChange={handleChange}
              className="border p-2 rounded w-full"

            >
              <option>Beec</option>
              <option>Hibo</option>
              <option>Waqaf</option>
           
            </select>
          </div>

        {/* ===== PRICE ===== */}
     {/* ===== PRICE ===== */}
      {form.agreementType === "Beec" && (
        <div className="">
          <div className="flex flex-col w-full">
            <label className="text-sm">Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      )}

       <div className="">

            <label className="text-sm">Office Fee</label>
            <input
              type="number"
              name="officeFee"
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
            <h3 className="font-semibold mb-3">Dhinaca 1aad (Seller)</h3>

            {["sellers", "agents", "guarantors"].map(role => (
              <div key={role} className="mb-3">
                <label className="text-sm capitalize">{role}</label>
                <select
                  className="border p-2 rounded w-full"
                  onChange={(e) => handleSelect("dhinac1", role, e.target.value)}
                >
                  <option value="">Select person</option>
                  {persons.map(p => (
                    <option key={p._id} value={p._id}>{p.fullName}</option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-2">
                  {form.dhinac1[role].map(id => {
                    const person = persons.find(p => p._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-blue-100 px-2 py-1 rounded text-xs cursor-pointer"
                        onClick={() => handleRemove("dhinac1", role, id)}
                      >
                        {person?.fullName} ✕
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* DHINAC 2 */}
          <div className="flex-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Dhinaca 2aad (Buyer)</h3>

            {["buyers", "agents", "guarantors"].map(role => (
              <div key={role} className="mb-3">
                <label className="text-sm capitalize">{role}</label>
                <select
                  className="border p-2 rounded w-full"
                  onChange={(e) => handleSelect("dhinac2", role, e.target.value)}
                >
                  <option value="">Select person</option>
                  {persons.map(p => (
                    <option key={p._id} value={p._id}>{p.fullName}</option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-2">
                  {form.dhinac2[role].map(id => {
                    const person = persons.find(p => p._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-green-100 px-2 py-1 rounded text-xs cursor-pointer"
                        onClick={() => handleRemove("dhinac2", role, id)}
                      >
                        {person?.fullName} ✕
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
          <button className="bg-amber-700 text-white px-6 py-2 rounded">
            Save Agreement
          </button>
        </div>

      </form>
    </div>
  );
};

export default Agreement;
