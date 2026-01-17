import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AgreementInfo from "./AgreementInfo";
import ServiceDetails from "./ServiceDetails";
import PersonsWitnesses from "./PersonsWitnesses";

const ViewAgreementLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState("info");

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch agreement with populated data
      const res = await axios.get(`/api/agreements/${id}`);
      setAgreement(res.data);

      // If serviceRef exists, fetch service data
      if (res.data?.serviceRef) {
        const serviceId =
          typeof res.data.serviceRef === "object"
            ? res.data.serviceRef._id
            : res.data.serviceRef;

        let serviceRes;

        switch (res.data.serviceType) {
          case "Motor":
            serviceRes = await axios.get(`/api/motors/${serviceId}`);
            break;
          case "Car":
            serviceRes = await axios.get(`/api/cars/${serviceId}`);
            break;
          case "Land":
            serviceRes = await axios.get(`/api/lands/${serviceId}`);
            break;
          case "Share":
            serviceRes = await axios.get(`/api/shares/${serviceId}`);
            break;
          default:
            return;
        }

        if (serviceRes?.data?._id) {
          setServiceData(serviceRes.data);
        }
      }
    } catch (error) {
      toast.error("Error fetching agreement data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ================= RENDER =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">Agreement not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Agreement Details</h1>
            <p>REF: {agreement.refNo} | Type: {agreement.serviceType}</p>
            <p className="text-sm mt-1">Created by: {agreement.createdBy?.username}</p>
          </div>
          <button onClick={() => navigate("/agreements")} className="bg-white text-blue-600 px-4 py-2 rounded">
            Back to List
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium ${activePage === "info" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActivePage("info")}
        >
          Agreement Info
        </button>
        <button
          className={`px-6 py-3 font-medium ${activePage === "service" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActivePage("service")}
        >
          Service Details
        </button>
        <button
          className={`px-6 py-3 font-medium ${activePage === "persons" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActivePage("persons")}
        >
          Persons & Witnesses
        </button>
      </div>

      {/* Page Content */}
      {activePage === "info" && (
        <AgreementInfo 
          agreement={agreement}
          fetchData={fetchData}
        />
      )}

      {activePage === "service" && (
        <ServiceDetails
          agreement={agreement}
          serviceData={serviceData}
          setServiceData={setServiceData}
          fetchData={fetchData}
        />
      )}

      {activePage === "persons" && (
        <PersonsWitnesses
          agreement={agreement}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default ViewAgreementLayout;