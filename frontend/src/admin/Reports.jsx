// import { useEffect, useState } from "react";
// import axios from "axios";

// const Share = () => {
//   const [shares, setShares] = useState([]);
//   const [formData, setFormData] = useState({
//     companyName: "",
//     acount: "",
//     ShareDate: "",
//   });

//   const API_URL = "/api/shares";

//   // 🔄 Get all shares
//   const fetchShares = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setShares(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchShares();
//   }, []);

//   // ✍️ Handle input
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ➕ Add share
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(API_URL, formData);
//       setFormData({ companyName: "", acount: "", ShareDate: "" });
//       fetchShares();
//     } catch (error) {
//       alert("Error while saving share");
//     }
//   };

//   // 🗑️ Delete share
//   const handleDelete = async (id) => {
//     if (!window.confirm("Ma hubtaa inaad delete gareyso?")) return;
//     await axios.delete(`${API_URL}/${id}`);
//     fetchShares();
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Share Management</h2>

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
//           name="ShareDate"
//           value={formData.ShareDate}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />

//         <button
//           type="submit"
//           className="col-span-3 bg-blue-600 text-white py-2 rounded"
//         >
//           Add Share
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
//           {shares.map((share) => (
//             <tr key={share._id}>
//               <td className="border p-2">{share.companyName}</td>
//               <td className="border p-2">{share.acount}</td>
//               <td className="border p-2">
//                 {share.ShareDate
//                   ? new Date(share.ShareDate).toLocaleDateString()
//                   : "-"}
//               </td>
//               <td className="border p-2 text-center">
//                 <button
//                   onClick={() => handleDelete(share._id)}
//                   className="bg-red-600 text-white px-3 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {shares.length === 0 && (
//             <tr>
//               <td colSpan="4" className="text-center p-4">
//                 No shares found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Share;
import React from 'react'

const Reports = () => {
  return (
    <div>
      Comming SoN
    </div>
  )
}

export default Reports
