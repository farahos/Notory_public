import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const ViewAgreements = () => {
  const [agreements, setAgreements] = useState([]);

  // search & filter states
  const [searchBy, setSearchBy] = useState("refNo");
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");


  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // ================= FETCH AGREEMENTS =================
  const fetchAgreements = async () => {
    try {
      const res = await axios.get("/api/agreements");
      setAgreements(res.data);
    } catch (err) {
      toast.error("Failed to fetch agreements");
      console.error(err);
    }
  };
  const handleSearch = () => {
  setSearchText(searchInput);
  setCurrentPage(1);
};


  useEffect(() => {
    fetchAgreements();
  }, []);

  // ================= DATE FILTER LOGIC =================
  const isInDateRange = (dateStr) => {
    if (!dateStr || dateFilter === "all") return true;

    const date = new Date(dateStr);
    const now = new Date();

    if (dateFilter === "today") {
      return date.toDateString() === now.toDateString();
    }

    if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo && date <= now;
    }

    if (dateFilter === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    return true;
  };

  // ================= FILTER + SEARCH =================
  const filteredAgreements = useMemo(() => {
    return agreements.filter((a) => {
      // date filter
      if (!isInDateRange(a.agreementDate)) return false;

      const text = searchText.toLowerCase();

      if (!text) return true;

      switch (searchBy) {
        case "refNo":
          return a.refNo?.toLowerCase().includes(text);

        case "ujeedo":
          return (
            a.agreementType?.toLowerCase().includes(text) ||
            a.serviceType?.toLowerCase().includes(text)
          );

        case "seller":
          return a.dhinac1?.sellers?.some((s) =>
            s.fullName?.toLowerCase().includes(text)
          );

        case "buyer":
          return a.dhinac2?.buyers?.some((b) =>
            b.fullName?.toLowerCase().includes(text)
          );

        default:
          return true;
      }
    });
  }, [agreements, searchBy, searchText, dateFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredAgreements.length / PAGE_SIZE);

  const paginatedData = filteredAgreements.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete agreement?")) return;
    try {
      await axios.delete(`/api/agreements/${id}`);
      toast.success("Agreement deleted");
      fetchAgreements();
    } catch (err) {
      toast.error("Failed to delete agreement");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Agreements</h2>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="refNo">Ref No</option>
          <option value="ujeedo">Ujeeddo</option>
          <option value="seller">Darafka Kowaad (Seller)</option>
          <option value="buyer">Darafka Labaad (Buyer)</option>
        </select>

        <input
  type="text"
  placeholder="Search..."
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
  className="border p-2 rounded w-64"
/>

     <button
  onClick={handleSearch}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Search
</button>

        <select
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="all">Dhammaan</option>
          <option value="today">Maanta</option>
          <option value="week">Isbuucan</option>
          <option value="month">Bishan</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Ref No</th>
            <th className="border p-2">Ujeeddo</th>
            <th className="border p-2">Darafka Kowaad</th>
            <th className="border p-2">Darafka Labaad</th>
            <th className="border p-2">Taarikh</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((a) => (
            <tr key={a._id}>
              <td className="border p-2 text-blue-600 underline">
                <Link to={`/agreement/${a._id}`}>{a.refNo}</Link>
              </td>

              <td className="border p-2">
                {a.agreementType} {a.serviceType}
              </td>

              <td className="border p-2">
                {a.dhinac1?.sellers?.map((s) => s.fullName).join(", ") || "N/A"}
              </td>

              <td className="border p-2">
                {a.dhinac2?.buyers?.map((b) => b.fullName).join(", ") || "N/A"}
              </td>

              <td className="border p-2">
                {a.agreementDate?.split("T")[0]}
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

          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                lama helin wax xog ah
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= PAGINATION CONTROLS ================= */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <div className="space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAgreements;
