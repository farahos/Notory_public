// import { useEffect, useState } from "react";
// import axios from "axios";

// const Saami = () => {
//   const [Saamis, setSaamis] = useState([]);
//   const [formData, setFormData] = useState({
//     companyName: "",
//     acount: "",
//     SaamiDate: "",
//   });

//   const API_URL = "/api/Saamis";

//   // 🔄 Get all Saamis
//   const fetchSaamis = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setSaamis(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchSaamis();
//   }, []);

//   // ✍️ Handle input
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ➕ Add Saami
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(API_URL, formData);
//       setFormData({ companyName: "", acount: "", SaamiDate: "" });
//       fetchSaamis();
//     } catch (error) {
//       alert("Error while saving Saami");
//     }
//   };

//   // 🗑️ Delete Saami
//   const handleDelete = async (id) => {
//     if (!window.confirm("Ma hubtaa inaad delete gareyso?")) return;
//     await axios.delete(`${API_URL}/${id}`);
//     fetchSaamis();
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Saami Management</h2>

//       {/* ➕ Form */}
//       <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           name="companyName"
//           placeholder="Company Name"
//           value={formData.companyName}
//           onChange={handleChange}
//           required
//           className="border p-2 rounded"
//         />

//         <input
//           type="number"
//           name="acount"
//           placeholder="Amount"
//           value={formData.acount}
//           onChange={handleChange}
//           required
//           className="border p-2 rounded"
//         />

//         <input
//           type="date"
//           name="SaamiDate"
//           value={formData.SaamiDate}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />

//         <button
//           type="submit"
//           className="col-span-3 bg-blue-600 text-white py-2 rounded"
//         >
//           Add Saami
//         </button>
//       </form>

//       {/* 📄 Table */}
//       <table className="w-full border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="border p-2">Company</th>
//             <th className="border p-2">Amount</th>
//             <th className="border p-2">Date</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Saamis.map((Saami) => (
//             <tr key={Saami._id}>
//               <td className="border p-2">{Saami.companyName}</td>
//               <td className="border p-2">{Saami.acount}</td>
//               <td className="border p-2">
//                 {Saami.SaamiDate
//                   ? new Date(Saami.SaamiDate).toLocaleDateString()
//                   : "-"}
//               </td>
//               <td className="border p-2 text-center">
//                 <button
//                   onClick={() => handleDelete(Saami._id)}
//                   className="bg-red-600 text-white px-3 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {Saamis.length === 0 && (
//             <tr>
//               <td colSpan="4" className="text-center p-4">
//                 No Saamis found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Saami;
import React from 'react'

const Reports = () => {
  return (
    <div>
      Comming SoN
    </div>
  )
}

export default Reports
