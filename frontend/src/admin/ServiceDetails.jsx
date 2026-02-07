import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ServiceDetails = ({ agreement, serviceData, setServiceData, fetchData }) => {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [tempService, setTempService] = useState(serviceData || {});

  // ================= SERVICE OPERATIONS =================
  const handleService = async (operation, data = null) => {
    try {
      if (!agreement?.serviceType) return;
      
      const endpoint = `/api/${agreement.serviceType.toLowerCase()}s`;
      
      switch(operation) {
        case "add":
        case "update":
          const method = operation === "add" ? "post" : "put";
          const url = operation === "add" ? endpoint : `${endpoint}/${serviceData?._id}`;
          const res = await axios[method](url, data || tempService);
          
          if (operation === "add") {
            await axios.put(`/api/agreements/${agreement._id}`, { 
              serviceRef: res.data._id 
            });
          }
          
          toast.success(`${agreement.serviceType} ${operation}d`);
          break;
        
        case "delete":
          await axios.delete(`${endpoint}/${serviceData._id}`);
          await axios.put(`/api/agreements/${agreement._id}`, { serviceRef: null });
          toast.success(`${agreement.serviceType} deleted`);
          setServiceData(null);
          break;
      }
      
      setShowServiceModal(false);
      fetchData();
    } catch (error) {
      toast.error(`Error ${operation}ing service`);
      console.error(error);
    }
  };

  const getServiceFields = () => {
    switch(agreement.serviceType) {
      case "Mooto":
        return [
          { key: "type", label: "Nooca", type: "text" },
          { key: "chassisNo", label: "Chassis No", type: "text" },
          { key: "modelYear", label: "Model Year", type: "number" },
          { key: "color", label: "Midab", type: "text" },
          { key: "cylinder", label: "Cylinder", type: "number" },
          { key: "plateNo", label: "Plate No", type: "text" },
          { key: "plateIssueDate", label: "Plate Issue Date", type: "date" },
          { key: "ownershipType", label: "Ownership Type", type: "select", options: ["Buug", "Kaarka"] },
          { key: "ownershipBookNo", label: "Ownership Book No", type: "text" },
          { key: "ownershipIssueDate", label: "Ownership Issue Date", type: "date" }
        ];
      case "Car":
        return [
          { key: "type", label: "Nooca", type: "text" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "chassisNo", label: "Chassis No", type: "text" },
          { key: "engineNo", label: "Engine No", type: "text" },
          { key: "modelYear", label: "Model Year", type: "number" },
          { key: "color", label: "Midab", type: "text" },
          { key: "plateNo", label: "Plate No", type: "text" },
          { key: "plateIssueDate", label: "Plate Issue Date", type: "date" }
        ];
      case "Land":
        return [
          { key: "titleNo", label: "Title No", type: "text" },
          { key: "location", label: "Goobta", type: "text" },
          { key: "area", label: "Aagga", type: "text" },
          { key: "buildingNumber", label: "Building Number", type: "text" },
          { key: "landNumber", label: "Land Number", type: "text" },
          { key: "deedNumber", label: "Deed Number", type: "text" },
          { key: "deedDate", label: "Deed Date", type: "date" }
        ];
      case "Saami":
        return [
          { key: "companyName", label: "Company Name", type: "select" , options: ["Hormuud Telecom Somalia Inc (HorTel)", "Beco"] },
          { key: "accountNumber", label: "Account Number", type: "text" },
          { key: "SaamiDate", label: "Saami Date", type: "date" }
        ];
      default:
        return [];
    }
  };

  const renderServiceDetails = () => {
    const service = serviceData || {};
    
    switch(agreement.serviceType) {
      case "Mooto":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><span className="font-medium">Nooca:</span> {service.type || "N/A"}</div>
            <div><span className="font-medium">Chassis No:</span> {service.chassisNo || "N/A"}</div>
            <div><span className="font-medium">Model:</span> {service.modelYear || "N/A"}</div>
            <div><span className="font-medium">Midab:</span> {service.color || "N/A"}</div>
            <div><span className="font-medium">Cylinder:</span> {service.cylinder || "N/A"}</div>
            <div><span className="font-medium">Taargo:</span> {service.plateNo || "N/A"}</div>
            <div><span className="font-medium">Plate Issue Date:</span> {service.plateIssueDate?.split("T")[0] || "N/A"}</div>
            <div><span className="font-medium">Ownership Type:</span> {service.ownershipType || "N/A"}</div>
            <div><span className="font-medium">Ownership Book No:</span> {service.ownershipBookNo || "N/A"}</div>
            <div><span className="font-medium">Ownership Issue Date:</span> {service.ownershipIssueDate?.split("T")[0] || "N/A"}</div>
          </div>
        );
      case "Car":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><span className="font-medium">Nooca:</span> {service.type || "N/A"}</div>
            <div><span className="font-medium">Brand:</span> {service.brand || "N/A"}</div>
            <div><span className="font-medium">Engine No:</span> {service.engineNo || "N/A"}</div>
            <div><span className="font-medium">Chassis No:</span> {service.chassisNo || "N/A"}</div>
            <div><span className="font-medium">Model Year:</span> {service.modelYear || "N/A"}</div>
            <div><span className="font-medium">Midab:</span> {service.color || "N/A"}</div>
            <div><span className="font-medium">Plate No:</span> {service.plateNo || "N/A"}</div>
            <div><span className="font-medium">Plate Issue Date:</span> {service.plateIssueDate?.split("T")[0] || "N/A"}</div>
          </div>
        );
      case "Land":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><span className="font-medium">Goobta:</span> {service.location || "N/A"}</div>
            <div><span className="font-medium">Aagga:</span> {service.area || "N/A"}</div>
            <div><span className="font-medium">Lambarka Dhisme:</span> {service.buildingNumber || "N/A"}</div>
            <div><span className="font-medium">Lambarka Dhulka:</span> {service.landNumber || "N/A"}</div>
            <div><span className="font-medium">Lambarka Deed:</span> {service.deedNumber || "N/A"}</div>
            <div><span className="font-medium">Deed Date:</span> {service.deedDate || "N/A"}</div>
            <div><span className="font-medium">Title No:</span> {service.titleNo || "N/A"}</div>
          </div>
        );
      case "Saami":
        return (
          <div className="grid grid-cols-3 gap-4">
            <div><span className="font-medium">Shirkadda:</span> {service.companyName || "N/A"}</div>
            <div><span className="font-medium">Acount:</span> {service.accountNumber || "N/A"}</div>
            <div><span className="font-medium">Date:</span> {service.SaamiDate?.split("T")[0] || "N/A"}</div>
          </div>
        );
      default:
        return <p className="text-gray-500">No service details available</p>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-xl">{agreement.serviceType} Details</h2>
            <p className="text-gray-600">Service information for agreement #{agreement.refNo}</p>
          </div>
          <div className="flex gap-3">
            {serviceData && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete this ${agreement.serviceType}?`)) {
                    handleService("delete");
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            )}
            <button
              onClick={() => {
                setTempService(serviceData || {});
                setShowServiceModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {serviceData ? 'Edit' : 'Add'} {agreement.serviceType}
            </button>
          </div>
        </div>
        
        {/* Service Details */}
        <div className="mt-6">
          {serviceData ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderServiceDetails()}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">No service linked to this agreement</p>
              <p className="text-gray-400 text-sm">Click "Add {agreement.serviceType}" to link a service</p>
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="font-bold text-lg">{serviceData ? 'Edit' : 'Add'} {agreement.serviceType}</h3>
              <button onClick={() => setShowServiceModal(false)} className="text-xl hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {getServiceFields().map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        value={tempService[field.key] || ""}
                        onChange={(e) => setTempService({...tempService, [field.key]: e.target.value})}
                        className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={tempService[field.key] || ""}
                        onChange={(e) => setTempService({...tempService, [field.key]: e.target.value})}
                        className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        type={field.type}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 justify-end mt-8">
                <button onClick={() => setShowServiceModal(false)} className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition">
                  Cancel
                </button>
                <button onClick={() => handleService(serviceData ? "update" : "add")} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">
                  {serviceData ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;