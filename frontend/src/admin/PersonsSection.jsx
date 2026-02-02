import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PersonCard from "./PersonCard";
import PersonModal from "./PersonModal";

const PersonsSection = ({
  title,
  side,
  role,
  buttonText,
  agreement,
  allPersons,
  setAllPersons,
  setActiveModal,
  fetchData,
  showDocumentOptions = false,
  agentDocuments,
  onRemoveDocument,
  onOpenLinkModal
}) => {
  const [newPerson, setNewPerson] = useState({
    fullName: "",
    motherName: "",
    birthPlace: "",
    birthYear: "",
    address: "",
    nationality: "",
    phone: "",
    gender: "Male",
    documentType: "Passport",
    documentNumber: ""
  });

  const [localActiveModal, setLocalActiveModal] = useState(null);

  // ================= PERSON OPERATIONS =================
  const handlePerson = async (operation, personId = null, data = null) => {
    try {
      console.log("Operation:", operation, "Person ID:", personId, "Data:", data);

      if (operation === "add") {
        // Check if person already exists
        const existingPerson = allPersons.find(
          p => p.phone === data.phone || 
          (data.documentNumber && p.documentNumber === data.documentNumber)
        );

        let finalPersonId; // Ka badal magaca variable-ka si aadan ugu dhawaaqin parameter-ka
        let finalPersonObj = null;
        if (existingPerson) {
          // Use existing person
          finalPersonId = existingPerson._id;
          finalPersonObj = existingPerson;
          console.log("Using existing person ID:", finalPersonId);
          toast.success("Existing person added to agreement");
        } else {
          // Create new person
          const res = await axios.post("/api/persons", data);
          finalPersonId = res.data._id;
          finalPersonObj = res.data;
          console.log("Created new person ID:", finalPersonId);
          toast.success("New person created and added to agreement");
          setAllPersons(prev => [...prev, res.data]);
        }

        // Add person to agreement
        await axios.put(`/api/agreements/${agreement._id}`, {
          [side]: {
            ...agreement[side],
            [role]: [...(agreement[side]?.[role] || []), finalPersonId],
          },
        });

        setLocalActiveModal(null);
        setNewPerson({
          fullName: "",
          motherName: "",
          birthPlace: "",
          birthYear: "",
          address: "",
          nationality: "",
          phone: "",
          gender: "Male",
          documentType: "Passport",
          documentNumber: "",
        });

        setTimeout(() => {
          fetchData();
        }, 100);

        // If this is an agent, require linking a Wakaalad immediately (Tasdiiq optional)
        try {
          if (role === 'agents' && onOpenLinkModal) {
            onOpenLinkModal(finalPersonObj || finalPersonId, 'Wakaalad', side);
          }
        } catch (err) {
          console.error('Error opening link modal after add:', err);
        }
      }

      if (operation === "update") {
        // Haddii personId aanu jirin, ka fiirso person object-ka
        if (!personId && data && data._id) {
          personId = data._id;
        }
        
        console.log("Updating person with ID:", personId);
        
        if (!personId) {
          throw new Error("Person ID is required for update");
        }
        
        await axios.put(`/api/persons/${personId}`, data);
        toast.success("Person updated");
        
        // Update allPersons list
        setAllPersons(prev => prev.map(p => 
          p._id === personId ? { ...p, ...data } : p
        ));
        
        setLocalActiveModal(null);
        fetchData();
      }

      if (operation === "delete") {
        console.log("Deleting person with ID:", personId);
        
        if (!personId) {
          throw new Error("Person ID is required for delete");
        }
        
        await axios.delete(`/api/persons/${personId}`);

        await axios.put(`/api/agreements/${agreement._id}`, {
          [side]: {
            ...agreement[side],
            [role]: (agreement[side]?.[role] || []).filter((p) => p._id !== personId),
          },
        });

        toast.success("Person deleted");
        
        // Update allPersons list
        setAllPersons(prev => prev.filter(p => p._id !== personId));
        
        fetchData();
      }
    } catch (error) {
      console.error("Error in handlePerson:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Operation failed: " + (error.response?.data?.message || error.message));
      fetchData();
    }
  };

  const persons = agreement[side]?.[role] || [];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">{title}</h3>
        <button
          onClick={() => setLocalActiveModal({type: 'addPerson'})}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {buttonText}
        </button>
      </div>
      
      {persons.length > 0 ? (
        persons.map((person, i) => {
          // Fiiri in person object-ku leeyahay _id
          if (!person || !person._id) {
            console.error("Person object is invalid:", person);
            return null;
          }
          
          return (
            <PersonCard
              key={person._id}
              person={person}
              index={i}
              side={side}
              role={role}
              showDocumentOptions={showDocumentOptions}
                agentDocument={agentDocuments?.[person._id]}
              onEdit={() => setLocalActiveModal({type: 'updatePerson', person})}
              onDelete={() => {
                if (window.confirm(`Delete ${person.fullName}?`)) {
                  handlePerson("delete", person._id);
                }
              }}
              onRemoveDocument={(docType) => onRemoveDocument && onRemoveDocument(person, docType)}
                onLinkDocument={(docType) => onOpenLinkModal && onOpenLinkModal(person, docType, side)}
            />
          );
        })
      ) : (
        <p className="text-gray-500 italic text-center py-8">No {title.toLowerCase()} added</p>
      )}

      {/* Person Modals */}
      {localActiveModal?.type === 'addPerson' && (
        <PersonModal
          mode="add"
          personData={newPerson}
          setPersonData={setNewPerson}
          allPersons={allPersons}
          onSubmit={(data) => handlePerson("add", null, data)}
          onClose={() => setLocalActiveModal(null)}
        />
      )}

      {localActiveModal?.type === 'updatePerson' && (
        <PersonModal
          mode="update"
          personData={localActiveModal.person}
          setPersonData={(data) => setLocalActiveModal({...localActiveModal, person: data})}
          allPersons={allPersons}
          onSubmit={(data) => handlePerson("update", localActiveModal.person._id, data)}
          onClose={() => setLocalActiveModal(null)}
        />
      )}
    </div>
  );
};

export default PersonsSection;