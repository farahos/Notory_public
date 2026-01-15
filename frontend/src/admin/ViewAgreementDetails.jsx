import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const ViewAgreementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(null);
  const [newWitness, setNewWitness] = useState("");
  const [serviceData, setServiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [editWitnessIndex, setEditWitnessIndex] = useState(null);
  const [editWitnessValue, setEditWitnessValue] = useState("");
  
  const [formData, setFormData] = useState({
    agreementDate: "",
    officeFee: "",
    sellingPrice: ""
  });

  const [newPerson, setNewPerson] = useState({
    fullName: "",
    motherName: "",
    birthPlace: "",
    birthYear: "",
    address: "",
    nationality: "",
    phone: "",
    documentType: "",
    documentNumber: ""
  });

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch agreement with populated data
      const res = await axios.get(`/api/agreements/${id}`);
      setAgreement(res.data);
      setFormData({
        agreementDate: res.data.agreementDate?.split('T')[0] || "",
        officeFee: res.data.officeFee || "",
        sellingPrice: res.data.sellingPrice || ""
      });

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

  useEffect(() => { fetchData(); }, [id]);

  // ================= AGREEMENT UPDATE =================
  const updateAgreement = async () => {
    try {
      await axios.put(`/api/agreements/${id}`, {
        agreementDate: formData.agreementDate,
        officeFee: formData.officeFee,
        sellingPrice: formData.sellingPrice
      });
      toast.success("Agreement updated");
      fetchData();
    } catch (error) {
      toast.error("Error updating agreement");
    }
  };

  // ================= PERSON OPERATIONS =================
  const handlePerson = async (operation, side, role, personId = null, data = null) => {
    try {
      switch(operation) {
        case "add":
          // First create the person
          const res = await axios.post("/api/persons", newPerson);
          
          // Then update agreement to add person reference
          const updatedAgreement = { ...agreement };
          if (!updatedAgreement[side][role]) {
            updatedAgreement[side][role] = [];
          }
          
          // Get current agreement from server
          const currentAgreement = await axios.get(`/api/agreements/${id}`);
          const currentPersons = currentAgreement.data[side][role] || [];
          
          // Add new person ID to the array
          const updatedPersons = [...currentPersons, res.data._id];
          
          // Update agreement with new person array
          await axios.put(`/api/agreements/${id}`, {
            [side]: {
              ...currentAgreement.data[side],
              [role]: updatedPersons
            }
          });
          
          toast.success("Person added");
          break;
        
        case "update":
          await axios.put(`/api/persons/${personId}`, data);
          toast.success("Person updated");
          break;
        
        case "delete":
          await axios.delete(`/api/persons/${personId}`);
          
          // Remove from agreement
          const currentAgreementRes = await axios.get(`/api/agreements/${id}`);
          const persons = currentAgreementRes.data[side][role] || [];
          const updated = persons.filter(id => id !== personId);
          
          await axios.put(`/api/agreements/${id}`, {
            [side]: {
              ...currentAgreementRes.data[side],
              [role]: updated
            }
          });
          
          toast.success("Person deleted");
          break;
      }
      
      fetchData();
      setActiveModal(null);
      setNewPerson({
        fullName: "",
        motherName: "",
        birthPlace: "",
        birthYear: "",
        address: "",
        nationality: "",
        phone: "",
        documentType: "",
        documentNumber: ""
      });
    } catch (error) {
      toast.error(`Error ${operation}ing person`);
      console.error(error);
    }
  };

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
          const res = await axios[method](url, data);
          
          if (operation === "add") {
            await axios.put(`/api/agreements/${id}`, { 
              serviceRef: res.data._id 
            });
          }
          
          toast.success(`${agreement.serviceType} ${operation}d`);
          break;
        
        case "delete":
          await axios.delete(`${endpoint}/${serviceData._id}`);
          await axios.put(`/api/agreements/${id}`, { serviceRef: null });
          toast.success(`${agreement.serviceType} deleted`);
          break;
      }
      
      setShowServiceModal(false);
      fetchData();
    } catch (error) {
      toast.error(`Error ${operation}ing service`);
      console.error(error);
    }
  };

  // ================= WITNESS OPERATIONS =================
  const handleWitness = async (operation, index = null) => {
    try {
      const witnesses = [...(agreement.witnesses || [])];
      
      if (operation === "add") {
        if (!newWitness.trim()) return toast.error("Enter witness name");
        witnesses.push(newWitness);
        setNewWitness("");
      } else if (operation === "update") {
        if (!editWitnessValue.trim()) return toast.error("Enter witness name");
        witnesses[index] = editWitnessValue;
        setEditWitnessIndex(null);
        setEditWitnessValue("");
      } else if (operation === "delete") {
        witnesses.splice(index, 1);
      }
      
      await axios.put(`/api/agreements/${id}`, { witnesses });
      toast.success(`Witness ${operation}d`);
      fetchData();
    } catch (error) {
      toast.error(`Error ${operation}ing witness`);
    }
  };

  // ================= DOWNLOAD WORD =================
  const downloadWord = async () => {
    const text = generateAgreementText();
    const doc = new Document({
      sections: [
        {
          children: text.split("\n").map(
            (line) => new Paragraph({
              children: [new TextRun({ text: line, font: "Arial" })],
            })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Agreement-${agreement.refNo}.docx`);
  };

  const generateAgreementText = () => {
    let serviceDetails = "";
    
    // Get service data from state
    const service = serviceData || {};

    switch(agreement.serviceType) {
      case "Motor":
        serviceDetails = `
          Nooca: ${service?.type || ""}
          Chassis No: ${service?.chassisNo || ""}
          Model: ${service?.modelYear || ""}
          Midab: ${service?.color || ""}
          Taargo: ${service?.plateNo || ""}
        `;
        break;
      case "Car":
        serviceDetails = `
          Nooca: ${service?.type || ""}
          Brand: ${service?.brand || ""}
          Chassis No: ${service?.chassisNo || ""}
          Engine No: ${service?.engineNo || ""}
          Model: ${service?.modelYear || ""}
          Midab: ${service?.color || ""}
          Taargo: ${service?.plateNo || ""}
        `;
        break;
      case "Land":
        serviceDetails = `
          Goobta: ${service?.location || ""}
          Aagga: ${service?.area || ""}
          Lambarka Dhisme: ${service?.buildingNumber || ""}
          Lambarka Dhulka: ${service?.landNumber || ""}
          Lambarka Deed: ${service?.deedNumber || ""}
        `;
        break;
      case "Share":
        serviceDetails = `
          Shirkadda: ${service?.companyName || ""}
          Akauntiga: ${service?.accountNumber || ""}
          Taariikhda Share-ka: ${service?.shareDate || ""}
        `;
        break;
    }

    // Get all sellers names
    const sellersNames = agreement.dhinac1?.sellers?.map(s => s.fullName).join(", ") || "";
    
    // Get all buyers names
    const buyersNames = agreement.dhinac2?.buyers?.map(b => b.fullName).join(", ") || "";

    return `
REF ${agreement.refNo}        ${agreement.agreementDate}

UJEEDDO: HESHIIS KALA GADASHO ${agreement.serviceType}

Maanta oo ay taariikhdu tahay ${agreement.agreementDate}, 
waxaa heshiis ah:

ISKA IIBIYAHA
${sellersNames}

IIBSADAHA
${buyersNames}

Anigoo ah ${sellersNames}, waxa aan ka iibiyey kuna wareejiyey 
${buyersNames} leh sifooyinkan:

${serviceDetails}

Qiimaha lagu kala iibsaday waa ${agreement.sellingPrice || 0} SHP.

Sidaasi darteed, milkiyadda waxay si sharci ah ugu wareegtay iibsadaha.

SAXIIXA ISKA IIBIYAHA
${sellersNames}

SAXIIXA IIBSADAHA
${buyersNames}

MARQAATIYAASHA
${agreement.witnesses?.map((w, i) => `${i + 1}. ${w}`).join("\n") || "N/A"}

SUGITAANKA NOOTAAYADA
REF: ${agreement.refNo}


NOOTAAYAHA
Dr. Maxamed Cabdiraxmaan Sheekh Maxamed
    `;
  };

  // ================= MODALS =================
  const PersonModal = ({ side, role }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold">Add Person</h3>
          <button onClick={() => setActiveModal(null)} className="text-xl">✕</button>
        </div>
        
        <div className="p-4 space-y-4">
          <input
            value={newPerson.fullName}
            onChange={(e) => setNewPerson({...newPerson, fullName: e.target.value})}
            placeholder="Full Name"
            className="border p-2 rounded w-full"
            required
          />
          <input
            value={newPerson.motherName}
            onChange={(e) => setNewPerson({...newPerson, motherName: e.target.value})}
            placeholder="Mother's Name"
            className="border p-2 rounded w-full"
          />
          <input
            value={newPerson.birthPlace}
            onChange={(e) => setNewPerson({...newPerson, birthPlace: e.target.value})}
            placeholder="Birth Place"
            className="border p-2 rounded w-full"
          />
          <input
            value={newPerson.birthYear}
            onChange={(e) => setNewPerson({...newPerson, birthYear: e.target.value})}
            placeholder="Birth Year"
            className="border p-2 rounded w-full"
          />
          <input
            value={newPerson.address}
            onChange={(e) => setNewPerson({...newPerson, address: e.target.value})}
            placeholder="Address"
            className="border p-2 rounded w-full"
          />
          <input
            value={newPerson.nationality}
            onChange={(e) => setNewPerson({...newPerson, nationality: e.target.value})}
            placeholder="Nationality"
            className="border p-2 rounded w-full"
          />
          <input
            value={newPerson.phone}
            onChange={(e) => setNewPerson({...newPerson, phone: e.target.value})}
            placeholder="Phone"
            className="border p-2 rounded w-full"
          />
          <select
            value={newPerson.documentType}
            onChange={(e) => setNewPerson({...newPerson, documentType: e.target.value})}
            className="border p-2 rounded w-full"
          >
            <option value="">Document Type</option>
            <option value="Passport">Passport</option>
            <option value="ID Card">ID Card</option>
            <option value="Niira">Niira</option>
            <option value="Sugnan">Sugnan</option>
          </select>
          <input
            value={newPerson.documentNumber}
            onChange={(e) => setNewPerson({...newPerson, documentNumber: e.target.value})}
            placeholder="Document Number"
            className="border p-2 rounded w-full"
          />
          
          <div className="flex gap-2 justify-end">
            <button onClick={() => setActiveModal(null)} className="bg-gray-400 px-4 py-2 rounded">
              Cancel
            </button>
            <button onClick={() => handlePerson("add", side, role)} className="bg-green-600 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const UpdatePersonModal = ({ person, side, role, index }) => {
    const [editPerson, setEditPerson] = useState({ ...person });

    const handleUpdate = async () => {
      try {
        await handlePerson("update", side, role, person._id, editPerson);
      } catch (error) {
        toast.error("Error updating person");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold">Update Person</h3>
            <button onClick={() => setActiveModal(null)} className="text-xl">✕</button>
          </div>
          
          <div className="p-4 space-y-4">
            <input
              value={editPerson.fullName}
              onChange={(e) => setEditPerson({...editPerson, fullName: e.target.value})}
              placeholder="Full Name"
              className="border p-2 rounded w-full"
            />
            <input
              value={editPerson.motherName}
              onChange={(e) => setEditPerson({...editPerson, motherName: e.target.value})}
              placeholder="Mother's Name"
              className="border p-2 rounded w-full"
            />
            <input
              value={editPerson.birthPlace}
              onChange={(e) => setEditPerson({...editPerson, birthPlace: e.target.value})}
              placeholder="Birth Place"
              className="border p-2 rounded w-full"
            />
            <input
              value={editPerson.birthYear}
              onChange={(e) => setEditPerson({...editPerson, birthYear: e.target.value})}
              placeholder="Birth Year"
              className="border p-2 rounded w-full"
            />
            <input
              value={editPerson.address}
              onChange={(e) => setEditPerson({...editPerson, address: e.target.value})}
              placeholder="Address"
              className="border p-2 rounded w-full"
            />
            <input
              value={editPerson.nationality}
              onChange={(e) => setEditPerson({...editPerson, nationality: e.target.value})}
              placeholder="Nationality"
              className="border p-2 rounded w-full"
            />
            <input
              value={editPerson.phone}
              onChange={(e) => setEditPerson({...editPerson, phone: e.target.value})}
              placeholder="Phone"
              className="border p-2 rounded w-full"
            />
            <input
              value={editPerson.documentNumber}
              onChange={(e) => setEditPerson({...editPerson, documentNumber: e.target.value})}
              placeholder="Document Number"
              className="border p-2 rounded w-full"
            />
            
            <div className="flex gap-2 justify-end">
              <button onClick={() => setActiveModal(null)} className="bg-gray-400 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServiceModal = () => {
    const [tempService, setTempService] = useState(serviceData || {});

    const handleServiceSubmit = async () => {
      try {
        if (serviceData) {
          await handleService("update", tempService);
        } else {
          await handleService("add", tempService);
        }
      } catch (error) {
        toast.error("Error saving service");
        console.error(error);
      }
    };

    const getServiceFields = () => {
      switch(agreement.serviceType) {
        case "Motor":
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
        case "Share":
          return [
            { key: "companyName", label: "Company Name", type: "text" },
            { key: "accountNumber", label: "Account Number", type: "text" },
            { key: "shareDate", label: "Share Date", type: "date" }
          ];
        default:
          return [];
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold">{serviceData ? 'Edit' : 'Add'} {agreement.serviceType}</h3>
            <button onClick={() => setShowServiceModal(false)} className="text-xl">✕</button>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {getServiceFields().map(field => (
                <div key={field.key}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      value={tempService[field.key] || ""}
                      onChange={(e) => setTempService({...tempService, [field.key]: e.target.value})}
                      className="border p-2 rounded w-full"
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
                      className="border p-2 rounded w-full"
                      type={field.type}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setShowServiceModal(false)} className="bg-gray-400 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleServiceSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
                {serviceData ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= RENDER PERSON CARD =================
  const PersonCard = ({ person, side, role, index }) => (
    <div className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg">{person.fullName}</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveModal({type: 'updatePerson', person, side, role, index})}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm("Delete this person?")) {
                handlePerson("delete", side, role, person._id);
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="font-medium">Hooyada:</span> {person.motherName || "N/A"}</div>
        <div><span className="font-medium">Phone:</span> {person.phone || "N/A"}</div>
        <div><span className="font-medium">Goobta Dhalashada:</span> {person.birthPlace || "N/A"}</div>
        <div><span className="font-medium">Sanadka Dhalashada:</span> {person.birthYear || "N/A"}</div>
        <div><span className="font-medium">Cinwaan:</span> {person.address || "N/A"}</div>
        <div><span className="font-medium">Qowmiyadda:</span> {person.nationality || "N/A"}</div>
        <div><span className="font-medium">Nooca Warqadda:</span> {person.documentType || "N/A"}</div>
        <div><span className="font-medium">Lambarka Warqadda:</span> {person.documentNumber || "N/A"}</div>
      </div>
    </div>
  );

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
          </div>
          <button onClick={() => navigate("/agreements")} className="bg-white text-blue-600 px-4 py-2 rounded">
            Back to List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agreement Info */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="font-bold text-lg mb-4">Agreement Information</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={formData.agreementDate}
                  onChange={(e) => setFormData({...formData, agreementDate: e.target.value})}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Office Fee</label>
                <input
                  type="number"
                  value={formData.officeFee}
                  onChange={(e) => setFormData({...formData, officeFee: e.target.value})}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Selling Price</label>
                <input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <button onClick={updateAgreement} className="bg-blue-600 text-white px-4 py-2 rounded">
              Update Agreement
            </button>
          </div>

          {/* Service Details */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{agreement.serviceType} Details</h2>
              <div className="flex gap-2">
                {serviceData && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete this ${agreement.serviceType}?`)) {
                        handleService("delete");
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {serviceData ? 'Edit' : 'Add'} {agreement.serviceType}
                </button>
              </div>
            </div>
            
            {serviceData ? (
              <div className="grid grid-cols-2 gap-4">
                {(() => {
                  switch(agreement.serviceType) {
                    case "Motor":
                      return (
                        <>
                          <div><span className="font-medium">Nooca:</span> {serviceData.type || "N/A"}</div>
                          <div><span className="font-medium">Chassis No:</span> {serviceData.chassisNo || "N/A"}</div>
                          <div><span className="font-medium">Model:</span> {serviceData.modelYear || "N/A"}</div>
                          <div><span className="font-medium">Midab:</span> {serviceData.color || "N/A"}</div>
                          <div><span className="font-medium">Cylinder:</span> {serviceData.cylinder || "N/A"}</div>
                          <div><span className="font-medium">Taargo:</span> {serviceData.plateNo || "N/A"}</div>
                        </>
                      );
                    case "Car":
                      return (
                        <>
                          <div><span className="font-medium">Nooca:</span> {serviceData.type || "N/A"}</div>
                          <div><span className="font-medium">Brand:</span> {serviceData.brand || "N/A"}</div>
                          <div><span className="font-medium">Engine No:</span> {serviceData.engineNo || "N/A"}</div>
                          <div><span className="font-medium">Chassis No:</span> {serviceData.chassisNo || "N/A"}</div>
                        </>
                      );
                    case "Land":
                      return (
                        <>
                          <div><span className="font-medium">Goobta:</span> {serviceData.location || "N/A"}</div>
                          <div><span className="font-medium">Aagga:</span> {serviceData.area || "N/A"}</div>
                          <div><span className="font-medium">Lambarka Dhulka:</span> {serviceData.landNumber || "N/A"}</div>
                        </>
                      );
                    case "Share":
                      return (
                        <>
                          <div><span className="font-medium">Shirkadda:</span> {serviceData.companyName || "N/A"}</div>
                          <div><span className="font-medium">Akauntiga:</span> {serviceData.accountNumber || "N/A"}</div>
                        </>
                      );
                    default:
                      return null;
                  }
                })()}
              </div>
            ) : (
              <p className="text-gray-500">No service linked</p>
            )}
          </div>

          {/* Sellers Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Dhinaca 1aad (Sellers)</h3>
              <button
                onClick={() => setActiveModal({type: 'addPerson', side: 'dhinac1', role: 'sellers'})}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                + Add Seller
              </button>
            </div>
            
            {agreement.dhinac1?.sellers?.length > 0 ? (
              agreement.dhinac1.sellers.map((person, i) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  side="dhinac1"
                  role="sellers"
                  index={i}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">No sellers added</p>
            )}
          </div>

          {/* Buyers Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Dhinaca 2aad (Buyers)</h3>
              <button
                onClick={() => setActiveModal({type: 'addPerson', side: 'dhinac2', role: 'buyers'})}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                + Add Buyer
              </button>
            </div>
            
            {agreement.dhinac2?.buyers?.length > 0 ? (
              agreement.dhinac2.buyers.map((person, i) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  side="dhinac2"
                  role="buyers"
                  index={i}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">No buyers added</p>
            )}
          </div>

          {/* Seller Agents Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Seller Agents</h3>
              <button
                onClick={() => setActiveModal({type: 'addPerson', side: 'dhinac1', role: 'agents'})}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                + Add Agent
              </button>
            </div>
            
            {agreement.dhinac1?.agents?.length > 0 ? (
              agreement.dhinac1.agents.map((person, i) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  side="dhinac1"
                  role="agents"
                  index={i}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">No seller agents added</p>
            )}
          </div>

          {/* Buyer Agents Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Buyer Agents</h3>
              <button
                onClick={() => setActiveModal({type: 'addPerson', side: 'dhinac2', role: 'agents'})}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                + Add Agent
              </button>
            </div>
            
            {agreement.dhinac2?.agents?.length > 0 ? (
              agreement.dhinac2.agents.map((person, i) => (
                <PersonCard
                  key={person._id}
                  person={person}
                  side="dhinac2"
                  role="agents"
                  index={i}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">No buyer agents added</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Download */}

          {}
          <div>
             <h3 className="font-bold mb-4 text-xl"> Created : {agreement.createdBy?.username}</h3>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
                        <h3 className="font-bold mb-4">Download</h3>

            <button
              onClick={downloadWord}
              className="bg-green-600 text-white px-4 py-3 rounded w-full"
            >
              Download Word Document
            </button>
          </div>

          {/* Witnesses */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-bold mb-4">Witnesses</h3>
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  value={newWitness}
                  onChange={(e) => setNewWitness(e.target.value)}
                  className="border p-2 rounded flex-1"
                  placeholder="Witness name"
                />
                <button onClick={() => handleWitness("add")} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {agreement.witnesses?.map((witness, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  {editWitnessIndex === i ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        value={editWitnessValue}
                        onChange={(e) => setEditWitnessValue(e.target.value)}
                        className="border p-1 rounded flex-1"
                        placeholder="Edit witness"
                      />
                      <button 
                        onClick={() => handleWitness("update", i)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setEditWitnessIndex(null);
                          setEditWitnessValue("");
                        }}
                        className="bg-gray-400 text-white px-2 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{witness}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditWitnessIndex(i);
                            setEditWitnessValue(witness);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleWitness("delete", i)} 
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal?.type === 'addPerson' && (
        <PersonModal side={activeModal.side} role={activeModal.role} />
      )}

      {activeModal?.type === 'updatePerson' && (
        <UpdatePersonModal 
          person={activeModal.person} 
          side={activeModal.side} 
          role={activeModal.role} 
          index={activeModal.index} 
        />
      )}

      {showServiceModal && <ServiceModal />}
    </div>
  );
};

export default ViewAgreementDetails;