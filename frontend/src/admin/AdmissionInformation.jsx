// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Mootocycle = () => {
//   const [Mootocycles, setMootocycles] = useState([]);
//   const [form, setForm] = useState({
//     type: "",
//     chassisNo: "",
//     modelYear: "",
//     color: "",
//     cylinder: "",
//     plateNo: "",
//     plateIssueDate: "",
//     ownershipType: "Buug",
//     ownershipBookNo: "",
//     ownershipIssueDate: "",
//   });

//   const fetchMootocycles = async () => {
//     const res = await axios.get("/api/Mootos");
//     setMootocycles(res.data);
//   };

//   useEffect(() => {
//     fetchMootocycles();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("/api/Mootos", form);
//       toast.success("Mootocycle saved successfully");
//       fetchMootocycles();
//       setForm({
//         type: "",
//         chassisNo: "",
//         modelYear: "",
//         color: "",
//         cylinder: "",
//         plateNo: "",
//         plateIssueDate: "",
//         ownershipType: "Buug",
//         ownershipBookNo: "",
//         ownershipIssueDate: "",
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error saving Mootocycle");
//     }
//   };

//   const deleteMootocycle = async (id) => {
//     if (!window.confirm("Delete this Mootocycle?")) return;
//     await axios.delete(`/api/Mootos/${id}`);
//     toast.success("Mootocycle deleted");
//     fetchMootocycles();
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h2 className="text-xl font-bold mb-4">Mootocycle Registration</h2>

//       {/* FORM */}
//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-4 gap-4 bg-white p-4 shadow rounded mb-6"
//       >
//         <input name="type" placeholder="Mootocycle Type" value={form.type} onChange={handleChange} className="border p-2" required />
//         <input name="chassisNo" placeholder="Chassis No" value={form.chassisNo} onChange={handleChange} className="border p-2" required />
//         <input name="modelYear" type="number" placeholder="Model Year" value={form.modelYear} onChange={handleChange} className="border p-2" required />
//         <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="border p-2" required />

//         <input name="cylinder" type="number" placeholder="Cylinder (CC)" value={form.cylinder} onChange={handleChange} className="border p-2" required />
//         <input name="plateNo" placeholder="Plate No" value={form.plateNo} onChange={handleChange} className="border p-2" required />
//         <input name="plateIssueDate" type="date" value={form.plateIssueDate} onChange={handleChange} className="border p-2" required />

//         <select name="ownershipType" value={form.ownershipType} onChange={handleChange} className="border p-2">
//           <option value="Buug">Buug</option>
//           <option value="Kaarka">Kaarka</option>
//         </select>

//         <input name="ownershipBookNo" placeholder="Ownership Book No" value={form.ownershipBookNo} onChange={handleChange} className="border p-2" required />
//         <input name="ownershipIssueDate" type="date" value={form.ownershipIssueDate} onChange={handleChange} className="border p-2" required />

//         <button className="col-span-4 bg-blue-600 text-white py-2 rounded">
//           Save Mootocycle
//         </button>
//       </form>

//       {/* TABLE */}
//       <table className="w-full border bg-white shadow">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">Type</th>
//             <th className="border p-2">Plate No</th>
//             <th className="border p-2">Chassis</th>
//             <th className="border p-2">Color</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Mootocycles.map((m) => (
//             <tr key={m._id}>
//               <td className="border p-2">{m.type}</td>
//               <td className="border p-2">{m.plateNo}</td>
//               <td className="border p-2">{m.chassisNo}</td>
//               <td className="border p-2">{m.color}</td>
//               <td className="border p-2 text-center">
//                 <button
//                   onClick={() => deleteMootocycle(m._id)}
//                   className="text-red-600"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Mootocycle;
import React from 'react'

const AdmissionInformation = () => {
  return (
    <div>
      
    </div>
  )
}

export default AdmissionInformation
