import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ViewAgreements = () => {
  const [agreements, setAgreements] = useState([]);

  // ================= FETCH AGREEMENTS =================
  const fetchAgreements = async () => {
    try {
      const res = await axios.get("/api/agreements"); 
      // backend-kaaga waa inuu populate sameeyaa dhinac1.sellers iyo dhinac2.buyers
      setAgreements(res.data);
    } catch (err) {
      toast.error("Failed to fetch agreements");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  // ================= DELETE AGREEMENT =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete agreement?")) return;
    try {
      await axios.delete(`/api/agreements/${id}`);
      toast.success("Agreement deleted");
      fetchAgreements();
    } catch (err) {
      toast.error("Failed to delete agreement");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Agreements</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Ref No</th>
            <th className="border p-2">Service</th>
            <th className="border p-2">Buyer(s)</th>
            <th className="border p-2">Seller(s)</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {agreements.map((a) => (
            <tr key={a._id}>
              <td className="border p-2 text-blue-600 underline">
                <Link to={`/agreement/${a._id}`}>{a.refNo}</Link>
              </td>
              <td className="border p-2">{a.agreementType } {a.serviceType}</td>

              {/* Buyers */}
              <td className="border p-2">
                {a.dhinac2?.buyers?.length > 0
                  ? a.dhinac2.buyers.map((b) => b.fullName).join(", ")
                  : "N/A"}
              </td>

              {/* Sellers */}
              <td className="border p-2">
                {a.dhinac1?.sellers?.length > 0
                  ? a.dhinac1.sellers.map((s) => s.fullName).join(", ")
                  : "N/A"}
              </td>

              <td className="border p-2">
                {a.agreementDate ? a.agreementDate.split("T")[0] : "N/A"}
              </td>

              <td className="border p-2">
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {agreements.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No agreements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAgreements;
