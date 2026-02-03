// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Motorcycle = () => {
//   const [motorcycles, setMotorcycles] = useState([]);
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

//   const fetchMotorcycles = async () => {
//     const res = await axios.get("/api/motors");
//     setMotorcycles(res.data);
//   };

//   useEffect(() => {
//     fetchMotorcycles();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("/api/motors", form);
//       toast.success("Motorcycle saved successfully");
//       fetchMotorcycles();
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
//       toast.error(error.response?.data?.message || "Error saving motorcycle");
//     }
//   };

//   const deleteMotorcycle = async (id) => {
//     if (!window.confirm("Delete this motorcycle?")) return;
//     await axios.delete(`/api/motors/${id}`);
//     toast.success("Motorcycle deleted");
//     fetchMotorcycles();
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h2 className="text-xl font-bold mb-4">Motorcycle Registration</h2>

//       {/* FORM */}
//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-4 gap-4 bg-white p-4 shadow rounded mb-6"
//       >
//         <input name="type" placeholder="Motorcycle Type" value={form.type} onChange={handleChange} className="border p-2" required />
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
//           Save Motorcycle
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
//           {motorcycles.map((m) => (
//             <tr key={m._id}>
//               <td className="border p-2">{m.type}</td>
//               <td className="border p-2">{m.plateNo}</td>
//               <td className="border p-2">{m.chassisNo}</td>
//               <td className="border p-2">{m.color}</td>
//               <td className="border p-2 text-center">
//                 <button
//                   onClick={() => deleteMotorcycle(m._id)}
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

// export default Motorcycle;
import React from 'react'

const AdmissionInformation = () => {
  return (
    <div>
      
    </div>
  )
}

export default AdmissionInformation
