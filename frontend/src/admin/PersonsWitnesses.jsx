// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const PersonsWitnesses = ({ agreement, fetchData }) => {
//   const [activeModal, setActiveModal] = useState(null);
//   const [newWitness, setNewWitness] = useState("");
//   const [editWitnessIndex, setEditWitnessIndex] = useState(null);
//   const [editWitnessValue, setEditWitnessValue] = useState("");
//   const [allPersons, setAllPersons] = useState([]); // persons database

//   const [newPerson, setNewPerson] = useState({
//     fullName: "",
//     motherName: "",
//     birthPlace: "",
//     birthYear: "",
//     address: "",
//     nationality: "",
//     phone: "",
//     gender: "Male",
//     documentType: "Passport",
//     documentNumber: ""
//   });

//   // ================= USE REF FOR INPUT FOCUS =================
//   const witnessInputRef = React.useRef(null);
//   const editWitnessInputRef = React.useRef(null);
  
//   // Fetch all persons on component mount
//   useEffect(() => {
//     const fetchPersons = async () => {
//       try {
//         const res = await axios.get("/api/persons");
//         setAllPersons(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchPersons();
//   }, []);

//   // Focus witness input when editing starts
//   useEffect(() => {
//     if (editWitnessIndex !== null && editWitnessInputRef.current) {
//       editWitnessInputRef.current.focus();
//     }
//   }, [editWitnessIndex]);

//   // ================= OPTIMIZED PERSON OPERATIONS =================
//   const handlePerson = async (operation, side, role, personId = null, data = null) => {
//     try {
//       if (operation === "add") {
//         // Check if person already exists (by phone or document number)
//         const existingPerson = allPersons.find(
//           p => p.phone === data.phone || 
//           (data.documentNumber && p.documentNumber === data.documentNumber)
//         );

//         let personId;
//         if (existingPerson) {
//           // Use existing person
//           personId = existingPerson._id;
//           toast.success("Existing person added to agreement");
//         } else {
//           // Create new person
//           const res = await axios.post("/api/persons", data);
//           personId = res.data._id;
//           toast.success("New person created and added to agreement");
          
//           // Update allPersons list
//           setAllPersons(prev => [...prev, res.data]);
//         }

//         // Add person to agreement
//         await axios.put(`/api/agreements/${agreement._id}`, {
//           [side]: {
//             ...agreement[side],
//             [role]: [...(agreement[side]?.[role] || []), personId],
//           },
//         });

//         setActiveModal(null);
//         setNewPerson({
//           fullName: "",
//           motherName: "",
//           birthPlace: "",
//           birthYear: "",
//           address: "",
//           nationality: "",
//           phone: "",
//           gender: "Male",
//           documentType: "Passport",
//           documentNumber: "",
//         });

//         setTimeout(() => {
//           fetchData();
//         }, 100);
//       }

//       if (operation === "update") {
//         await axios.put(`/api/persons/${personId}`, data);
//         toast.success("Person updated");
        
//         // Update allPersons list
//         setAllPersons(prev => prev.map(p => 
//           p._id === personId ? { ...p, ...data } : p
//         ));
        
//         setActiveModal(null);
//         fetchData();
//       }

//       if (operation === "delete") {
//         await axios.delete(`/api/persons/${personId}`);

//         await axios.put(`/api/agreements/${agreement._id}`, {
//           [side]: {
//             ...agreement[side],
//             [role]: (agreement[side]?.[role] || []).filter((p) => p._id !== personId),
//           },
//         });

//         toast.success("Person deleted");
        
//         // Update allPersons list
//         setAllPersons(prev => prev.filter(p => p._id !== personId));
        
//         fetchData();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Operation failed");
//       fetchData();
//     }
//   };

//   // ================= OPTIMIZED WITNESS OPERATIONS =================
//   const handleWitness = async (operation, index = null) => {
//     try {
//       let updatedWitnesses = [...(agreement.witnesses || [])];
      
//       if (operation === "add") {
//         if (!newWitness.trim()) {
//           toast.error("Enter witness name");
//           return;
//         }
//         updatedWitnesses.push(newWitness);
//       } else if (operation === "update") {
//         if (!editWitnessValue.trim()) {
//           toast.error("Enter witness name");
//           return;
//         }
//         updatedWitnesses[index] = editWitnessValue;
//       } else if (operation === "delete") {
//         updatedWitnesses.splice(index, 1);
//       }
      
//       if (agreement.witnesses) {
//         agreement.witnesses = updatedWitnesses;
//       }
      
//       await axios.put(`/api/agreements/${agreement._id}`, { 
//         witnesses: updatedWitnesses 
//       });
      
//       toast.success(`Witness ${operation}d`);
      
//       if (operation === "add") {
//         setNewWitness("");
//       } else if (operation === "update") {
//         setEditWitnessIndex(null);
//         setEditWitnessValue("");
//       }
      
//       fetchData();
//     } catch (error) {
//       toast.error(`Error ${operation}ing witness`);
//       fetchData();
//     }
//   };

//   // ================= OPTIMIZED PERSON MODAL =================
//   const PersonModal = ({ side, role }) => {
//     const [localPerson, setLocalPerson] = useState({ ...newPerson });
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [searchResults, setSearchResults] = useState([]);
//     const [selectedExistingPerson, setSelectedExistingPerson] = useState(null);
//     const [isExistingMode, setIsExistingMode] = useState("cusub"); // "cusub" or "keydsan"
//     const [searchQuery, setSearchQuery] = useState("");

//     // Search persons when query changes
//     useEffect(() => {
//       if (searchQuery.trim() && isExistingMode === "keydsan") {
//         const results = allPersons.filter(person =>
//           person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           person.phone.includes(searchQuery) ||
//           (person.documentNumber && person.documentNumber.includes(searchQuery))
//         );
//         setSearchResults(results);
//       } else {
//         setSearchResults([]);
//       }
//     }, [searchQuery, isExistingMode, allPersons]);

//     const handleSubmit = async () => {
//       if (isSubmitting) return;
      
//       if (isExistingMode === "keydsan" && selectedExistingPerson) {
//         // Use existing person
//         setIsSubmitting(true);
//         try {
//           await handlePerson("add", side, role, null, {
//             ...selectedExistingPerson,
//             // Keep the reference to existing person
//           });
//         } finally {
//           setIsSubmitting(false);
//         }
//       } else {
//         // Create new person
//         setIsSubmitting(true);
//         try {
//           await handlePerson("add", side, role, null, localPerson);
//         } finally {
//           setIsSubmitting(false);
//         }
//       }
//     };

//     const handleSelectExistingPerson = (person) => {
//       setSelectedExistingPerson(person);
//       setSearchQuery(person.fullName);
//       setSearchResults([]);
//     };

//     const handleModeChange = (mode) => {
//       setIsExistingMode(mode);
//       setSelectedExistingPerson(null);
//       setSearchQuery("");
//       setSearchResults([]);
      
//       if (mode === "cusub") {
//         setLocalPerson({
//           fullName: "",
//           motherName: "",
//           birthPlace: "",
//           birthYear: "",
//           address: "",
//           nationality: "",
//           phone: "",
//           gender: "Male",
//           documentType: "Passport",
//           documentNumber: ""
//         });
//       }
//     };

//     return (
//      <div className="fixed inset-0  bg-opacity-100 flex items-center justify-center z-50 p-4">
//   {/* Modal container */}
//   <div className="bg-gray-100 w-full max-w-[600px] rounded-lg overflow-y-auto max-h-[90vh] p-6 grid grid-cols-2 gap-4">
    
//     {/* Header (spans both columns) */}
//     <div className="col-span-2 flex justify-between items-center border-b pb-4 mb-4">
//       <h3 className="font-bold text-lg">Add Person</h3>
//       <button 
//         onClick={() => setActiveModal(null)} 
//         className="text-xl hover:text-gray-600"
//         disabled={isSubmitting}
//       >
//         ✕
//       </button>
//     </div>

//     {/* Mode Selection (spans both columns) */}
//     <div className="col-span-2 flex gap-4 mb-4">
//       <button
//         type="button"
//         onClick={() => handleModeChange("cusub")}
//         className={`flex-1 py-3 rounded-lg transition ${isExistingMode === "cusub" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//       >
//         Person Cusub
//       </button>
//       <button
//         type="button"
//         onClick={() => handleModeChange("keydsan")}
//         className={`flex-1 py-3 rounded-lg transition ${isExistingMode === "keydsan" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//       >
//         Person Keydsan
//       </button>
//     </div>

//     {/* Existing Person Search Mode */}
//     {isExistingMode === "keydsan" && (
//       <div className="col-span-2 space-y-4">
//         <label className="block text-sm font-medium mb-1">Raadi Person</label>
//         <input
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Geli magaca ama telefoonka"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//         {searchResults.length > 0 && (
//           <div className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
//             {searchResults.map((person) => (
//               <div
//                 key={person._id}
//                 className="p-3 border-b hover:bg-gray-50 cursor-pointer"
//                 onClick={() => handleSelectExistingPerson(person)}
//               >
//                 <div className="font-medium">{person.fullName}</div>
//                 <div className="text-sm text-gray-600">
//                   {person.phone && `Tel: ${person.phone}`}
//                   {person.documentNumber && ` | ID: ${person.documentNumber}`}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         {selectedExistingPerson && (
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h4 className="font-bold text-blue-700 mb-2">Person La Doortay:</h4>
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <div><span className="font-medium">Magaca:</span> {selectedExistingPerson.fullName}</div>
//               <div><span className="font-medium">Telefoon:</span> {selectedExistingPerson.phone || "N/A"}</div>
//               <div><span className="font-medium">Hooyada:</span> {selectedExistingPerson.motherName || "N/A"}</div>
//               <div><span className="font-medium">Jinsiga:</span> {selectedExistingPerson.gender || "N/A"}</div>
//               <div><span className="font-medium">Nooca Warqadda:</span> {selectedExistingPerson.documentType || "N/A"}</div>
//               <div><span className="font-medium">Nambarka:</span> {selectedExistingPerson.documentNumber || "N/A"}</div>
//             </div>
//           </div>
//         )}
//       </div>
//     )}

//     {/* New Person Form Mode */}
//     {isExistingMode === "cusub" && (
//       <>
//         <input
//           value={localPerson.fullName}
//           onChange={(e) => setLocalPerson({ ...localPerson, fullName: e.target.value })}
//           placeholder="Full Name"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//         <input
//           value={localPerson.motherName}
//           onChange={(e) => setLocalPerson({ ...localPerson, motherName: e.target.value })}
//           placeholder="Mother's Name"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//         <input
//           value={localPerson.birthPlace}
//           onChange={(e) => setLocalPerson({ ...localPerson, birthPlace: e.target.value })}
//           placeholder="Birth Place"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//         <input
//           value={localPerson.birthYear}
//           onChange={(e) => setLocalPerson({ ...localPerson, birthYear: e.target.value })}
//           placeholder="Birth Year"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//         <input
//           value={localPerson.address}
//           onChange={(e) => setLocalPerson({ ...localPerson, address: e.target.value })}
//           placeholder="Address"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//         <input
//           value={localPerson.nationality}
//           onChange={(e) => setLocalPerson({ ...localPerson, nationality: e.target.value })}
//           placeholder="Nationality"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//         <input
//           value={localPerson.phone}
//           onChange={(e) => setLocalPerson({ ...localPerson, phone: e.target.value })}
//           placeholder="Phone"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//         <select
//           value={localPerson.gender}
//           onChange={(e) => setLocalPerson({ ...localPerson, gender: e.target.value })}
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         >
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//         </select>
//         <select
//           value={localPerson.documentType}
//           onChange={(e) => setLocalPerson({ ...localPerson, documentType: e.target.value })}
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         >
//           <option value="Passport">Passport</option>
//           <option value="ID Card">ID Card</option>
//           <option value="Niira">Niira</option>
//           <option value="Sugnan">Sugnan</option>
//         </select>
//         <input
//           value={localPerson.documentNumber}
//           onChange={(e) => setLocalPerson({ ...localPerson, documentNumber: e.target.value })}
//           placeholder="Document Number"
//           className="border border-gray-300 p-3 rounded w-full"
//           disabled={isSubmitting}
//         />
//       </>
//     )}

//     {/* Buttons (spans both columns) */}
//     <div className="col-span-2 flex gap-3 justify-end mt-4">
//       <button
//         onClick={() => setActiveModal(null)}
//         className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition disabled:opacity-50"
//         disabled={isSubmitting}
//       >
//         Cancel
//       </button>
//       <button
//         onClick={handleSubmit}
//         className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//         disabled={isSubmitting || (isExistingMode === "keydsan" && !selectedExistingPerson)}
//       >
//         {isSubmitting ? "Adding..." : "Add Person"}
//       </button>
//     </div>

//   </div>
// </div>

//     );
//   };

//   // ================= OPTIMIZED UPDATE PERSON MODAL =================
//   const UpdatePersonModal = ({ person, side, role }) => {
//     const [editPerson, setEditPerson] = useState({ ...person });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleUpdate = async () => {
//       if (isSubmitting) return;
      
//       setIsSubmitting(true);
//       try {
//         await handlePerson("update", side, role, person._id, editPerson);
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

//     return (
//      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
//   <div className="bg-gray-100 rounded-lg w-full max-w-[700px] max-h-[90vh] overflow-y-auto p-6 grid grid-cols-2 gap-4">
    
//     {/* Header spans 2 columns */}
//     <div className="col-span-2 flex justify-between items-center border-b pb-4 mb-4">
//       <h3 className="font-bold text-lg">Update Person</h3>
//       <button 
//         onClick={() => setActiveModal(null)} 
//         className="text-xl hover:text-gray-600"
//         disabled={isSubmitting}
//       >
//         ✕
//       </button>
//     </div>

//     {/* Form Inputs */}
//     <input
//       value={editPerson.fullName}
//       onChange={(e) => setEditPerson({ ...editPerson, fullName: e.target.value })}
//       placeholder="Full Name"
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     />

//     <input
//       value={editPerson.motherName}
//       onChange={(e) => setEditPerson({ ...editPerson, motherName: e.target.value })}
//       placeholder="Mother's Name"
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     />

//     <input
//       value={editPerson.birthPlace}
//       onChange={(e) => setEditPerson({ ...editPerson, birthPlace: e.target.value })}
//       placeholder="Birth Place"
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     />

//     <input
//       value={editPerson.birthYear}
//       onChange={(e) => setEditPerson({ ...editPerson, birthYear: e.target.value })}
//       placeholder="Birth Year"
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     />

//     <input
//       value={editPerson.address}
//       onChange={(e) => setEditPerson({ ...editPerson, address: e.target.value })}
//       placeholder="Address"
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     />

//     <input
//       value={editPerson.nationality}
//       onChange={(e) => setEditPerson({ ...editPerson, nationality: e.target.value })}
//       placeholder="Nationality"
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     />

//     <input
//       value={editPerson.phone}
//       onChange={(e) => setEditPerson({ ...editPerson, phone: e.target.value })}
//       placeholder="Phone"
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     />

//     <select
//       value={editPerson.gender}
//       onChange={(e) => setEditPerson({ ...editPerson, gender: e.target.value })}
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     >
//       <option value="">Gender</option>
//       <option value="Male">Male</option>
//       <option value="Female">Female</option>
//     </select>

//     <select
//       value={editPerson.documentType}
//       onChange={(e) => setEditPerson({ ...editPerson, documentType: e.target.value })}
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       disabled={isSubmitting}
//     >
//       <option value="">Document Type</option>
//       <option value="Passport">Passport</option>
//       <option value="ID Card">ID Card</option>
//       <option value="Niira">Niira</option>
//       <option value="Sugnan">Sugnan</option>
//     </select>

//     <input
//       value={editPerson.documentNumber}
//       onChange={(e) => setEditPerson({ ...editPerson, documentNumber: e.target.value })}
//       placeholder="Document Number"
//       className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 col-span-2"
//       disabled={isSubmitting}
//     />

//     {/* Buttons spans 2 columns */}
//     <div className="col-span-2 flex gap-3 justify-end mt-4">
//       <button
//         onClick={() => setActiveModal(null)}
//         className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition disabled:opacity-50"
//         disabled={isSubmitting}
//       >
//         Cancel
//       </button>
//       <button
//         onClick={handleUpdate}
//         className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//         disabled={isSubmitting}
//       >
//         {isSubmitting ? "Updating..." : "Update Person"}
//       </button>
//     </div>
//   </div>
// </div>

//     );
//   };

//   // ================= PERSON CARD (Memoized) =================
//   const PersonCard = React.memo(({ person, side, role, index }) => (
//     <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition">
//       <div className="flex justify-between items-start mb-3">
//         <h4 className="font-bold text-lg text-blue-600">{person.fullName}</h4>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setActiveModal({type: 'updatePerson', person, side, role, index})}
//             className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => {
//               if (window.confirm("Delete this person?")) {
//                 handlePerson("delete", side, role, person._id);
//               }
//             }}
//             className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-2 gap-3 text-sm">
//         <div><span className="font-medium">Hooyada:</span> {person.motherName || "N/A"}</div>
//         <div><span className="font-medium">Phone:</span> {person.phone || "N/A"}</div>
//         <div><span className="font-medium">Gender:</span> {person.gender || "N/A"}</div>
//         <div><span className="font-medium">Goobta Dhalashada:</span> {person.birthPlace || "N/A"}</div>
//         <div><span className="font-medium">Sanadka Dhalashada:</span> {person.birthYear || "N/A"}</div>
//         <div><span className="font-medium">Cinwaan:</span> {person.address || "N/A"}</div>
//         <div><span className="font-medium">Qowmiyadda:</span> {person.nationality || "N/A"}</div>
//         <div><span className="font-medium">Nooca Warqadda:</span> {person.documentType || "N/A"}</div>
//         <div><span className="font-medium">Lambarka Warqadda:</span> {person.documentNumber || "N/A"}</div>
//       </div>
//     </div>
//   ));

//   // ================= OPTIMIZED RENDER SECTIONS =================
//   const renderSection = React.useCallback((title, side, role, buttonText) => (
//     <div className="bg-white shadow rounded-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="font-bold text-xl">{title}</h3>
//         <button
//           onClick={() => setActiveModal({type: 'addPerson', side, role})}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           {buttonText}
//         </button>
//       </div>
      
//       {agreement[side]?.[role]?.length > 0 ? (
//         agreement[side][role].map((person, i) => (
//           <PersonCard
//             key={person._id}
//             person={person}
//             side={side}
//             role={role}
//             index={i}
//           />
//         ))
//       ) : (
//         <p className="text-gray-500 italic text-center py-8">No {title.toLowerCase()} added</p>
//       )}
//     </div>
//   ), [agreement]);

//   return (
//     <div className="space-y-8">
     

//       {/* Sellers Section */}
//       {renderSection("Sellers", "dhinac1", "sellers", "+ Add Seller")}

//       {/* Seller Agents Section */}
//       {renderSection("Seller Agents", "dhinac1", "agents", "+ Add Agent")}
//       {renderSection("Seller Agents", "dhinac1", "agents", "+ Add wakaalad")}
//       {renderSection("Seller Agents", "dhinac1", "agents", "+ Add tasdiiq")}

      


//       {/* Buyers Section */}
//       {renderSection("Buyers", "dhinac2", "buyers", "+ Add Buyer")}

      

//       {/* Buyer Agents Section */}
//       {renderSection("Buyer Agents", "dhinac2", "agents", "+ Add Agent")}

//       {/* Modals */}
//       {activeModal?.type === 'addPerson' && (
//         <PersonModal side={activeModal.side} role={activeModal.role} />
//       )}
//        {/* Witnesses Section */}
//       <div className="bg-white shadow rounded-lg p-6">
//         <h3 className="font-bold text-xl mb-6">Witnesses</h3>
//         <div className="mb-6">
//           <div className="flex gap-3">
//             <input
//               ref={witnessInputRef}
//               value={newWitness}
//               onChange={(e) => setNewWitness(e.target.value)}
//               className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Witness name"
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' && newWitness.trim()) {
//                   handleWitness("add");
//                 }
//               }}
//             />
//             <button 
//               onClick={() => handleWitness("add")}
//               disabled={!newWitness.trim()}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Add Witness
//             </button>
//           </div>
//         </div>
        
//         <div className="space-y-3">
//           {agreement.witnesses?.map((witness, i) => (
//             <div key={i} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
//               {editWitnessIndex === i ? (
//                 <div className="flex gap-3 flex-1">
//                   <input
//                     ref={editWitnessInputRef}
//                     value={editWitnessValue}
//                     onChange={(e) => setEditWitnessValue(e.target.value)}
//                     className="border border-gray-300 p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Edit witness"
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && editWitnessValue.trim()) {
//                         handleWitness("update", i);
//                       }
//                     }}
//                   />
//                   <button 
//                     onClick={() => handleWitness("update", i)}
//                     disabled={!editWitnessValue.trim()}
//                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
//                   >
//                     Save
//                   </button>
//                   <button 
//                     onClick={() => {
//                       setEditWitnessIndex(null);
//                       setEditWitnessValue("");
//                     }}
//                     className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-3">
//                     <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
//                       {i + 1}
//                     </span>
//                     <span className="font-medium">{witness}</span>
//                   </div>
//                   <div className="flex gap-3">
//                     <button 
//                       onClick={() => {
//                         setEditWitnessIndex(i);
//                         setEditWitnessValue(witness);
//                       }}
//                       className="text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                       Edit
//                     </button>
//                     <button 
//                       onClick={() => handleWitness("delete", i)} 
//                       className="text-red-600 hover:text-red-800 font-medium"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
          
//           {(!agreement.witnesses || agreement.witnesses.length === 0) && (
//             <p className="text-gray-500 italic text-center py-8">No witnesses added</p>
//           )}
//         </div>
//       </div>

//       {activeModal?.type === 'updatePerson' && (
//         <UpdatePersonModal 
//           person={activeModal.person} 
//           side={activeModal.side} 
//           role={activeModal.role} 
//           index={activeModal.index} 
//         />
//       )}
//     </div>
//   );
// };

// export default PersonsWitnesses;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PersonsSection from "./PersonsSection";
import WitnessesSection from "./WitnessesSection";
import DocumentModals from "./DocumentModals";

const PersonsWitnesses = ({ agreement, fetchData }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [allPersons, setAllPersons] = useState([]);
  const [wakaalads, setWakaalads] = useState([]);
  const [tasdiiqs, setTasdiiqs] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("Wakaalad");
  
  // New document states
  const [newWakaalad, setNewWakaalad] = useState({
    wakaladType: "Wakaalad Guud",
    refNo: "",
    date: "",
    kasooBaxday: "",
    xafiisKuYaal: "",
    saxiix1: "",
    saxiix2: ""
  });

  const [newTasdiiq, setNewTasdiiq] = useState({
    refNo: "",
    date: "",
    kasooBaxday: ""
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [personsRes, wakaaladsRes, tasdiiqsRes] = await Promise.all([
          axios.get("/api/persons"),
          axios.get("/api/wakaalads"),
          axios.get("/api/tasdiiqs")
        ]);
        
        setAllPersons(personsRes.data);
        setWakaalads(wakaaladsRes.data);
        setTasdiiqs(tasdiiqsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchAllData();
  }, []);

  // ================= AGENT DOCUMENT FUNCTIONS (per-agent) =================
  const handleAddAgentDocument = async (agent, docType, docId, side = 'dhinac1') => {
    try {
      const agentId = agent?._id || agent;
      const current = agreement[side] || {};
      const agentDocuments = current.agentDocuments || {};
      const existing = agentDocuments[agentId] || {};
      const field = docType === 'Wakaalad' ? 'wakaalad' : 'tasdiiq';
      const updatedAgentDocs = {
        ...agentDocuments,
        [agentId]: { ...existing, [field]: docId }
      };

      await axios.put(`/api/agreements/${agreement._id}`, {
        [side]: {
          ...agreement[side],
          agentDocuments: updatedAgentDocs
        }
      });

      toast.success(`${docType} linked to agent`);
      fetchData();
    } catch (error) {
      console.error("Error linking document:", error);
      toast.error("Failed to link document");
      throw error;
    }
  };

  const handleRemoveAgentDocument = async (agent, docType, side = 'dhinac1') => {
    try {
      const agentId = agent?._id || agent;
      const current = agreement[side] || {};
      const agentDocuments = { ...(current.agentDocuments || {}) };
      const existing = agentDocuments[agentId] || {};
      const field = docType === 'Wakaalad' ? 'wakaalad' : 'tasdiiq';

      if (existing) {
        const updated = { ...existing };
        delete updated[field];
        if (Object.keys(updated).length === 0) {
          delete agentDocuments[agentId];
        } else {
          agentDocuments[agentId] = updated;
        }
      }

      await axios.put(`/api/agreements/${agreement._id}`, {
        [side]: {
          ...agreement[side],
          agentDocuments
        }
      });

      toast.success(`${docType} removed from agent`);
      fetchData();
    } catch (error) {
      console.error("Error removing document:", error);
      toast.error("Failed to remove document");
      throw error;
    }
  };

  // ================= CREATE DOCUMENT FUNCTIONS =================
  const handleCreateWakaalad = async () => {
    try {
      const res = await axios.post("/api/wakaalads", newWakaalad);
      toast.success("Wakaalad created successfully!");
      
      setWakaalads(prev => [...prev, res.data]);
      setNewWakaalad({
        wakaladType: "Wakaalad Guud",
        refNo: "",
        date: "",
        kasooBaxday: "",
        xafiisKuYaal: "",
        saxiix1: "",
        saxiix2: ""
      });
      
      return res.data; // Return the created document
    } catch (error) {
      console.error("Error creating wakaalad:", error);
      toast.error("Failed to create wakaalad");
      throw error;
    }
  };

  const handleCreateTasdiiq = async () => {
    try {
      const res = await axios.post("/api/tasdiiqs", newTasdiiq);
      toast.success("Tasdiiq created successfully!");
      
      setTasdiiqs(prev => [...prev, res.data]);
      setNewTasdiiq({
        refNo: "",
        date: "",
        kasooBaxday: ""
      });
      
      return res.data; // Return the created document
    } catch (error) {
      console.error("Error creating tasdiiq:", error);
      toast.error("Failed to create tasdiiq");
      throw error;
    }
  };

  // ================= UPDATE / DELETE DOCUMENTS =================
  const handleUpdateWakaalad = async (id, updatedData) => {
    try {
      const res = await axios.put(`/api/wakaalads/${id}`, updatedData);
      setWakaalads(prev => prev.map(d => d._id === id ? res.data : d));
      toast.success("Wakaalad updated");
      return res.data;
    } catch (error) {
      console.error("Error updating wakaalad:", error);
      toast.error("Failed to update wakaalad");
      throw error;
    }
  };

  const handleDeleteWakaalad = async (id) => {
    try {
      await axios.delete(`/api/wakaalads/${id}`);
      setWakaalads(prev => prev.filter(d => d._id !== id));
      toast.success("Wakaalad deleted");
    } catch (error) {
      console.error("Error deleting wakaalad:", error);
      toast.error("Failed to delete wakaalad");
      throw error;
    }
  };

  const handleUpdateTasdiiq = async (id, updatedData) => {
    try {
      const res = await axios.put(`/api/tasdiiqs/${id}`, updatedData);
      setTasdiiqs(prev => prev.map(d => d._id === id ? res.data : d));
      toast.success("Tasdiiq updated");
      return res.data;
    } catch (error) {
      console.error("Error updating tasdiiq:", error);
      toast.error("Failed to update tasdiiq");
      throw error;
    }
  };

  const handleDeleteTasdiiq = async (id) => {
    try {
      await axios.delete(`/api/tasdiiqs/${id}`);
      setTasdiiqs(prev => prev.filter(d => d._id !== id));
      toast.success("Tasdiiq deleted");
    } catch (error) {
      console.error("Error deleting tasdiiq:", error);
      toast.error("Failed to delete tasdiiq");
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      {/* Sellers Section */}
      <PersonsSection
        title="Sellers"
        side="dhinac1"
        role="sellers"
        buttonText="+ Add Seller"
        agreement={agreement}
        allPersons={allPersons}
        setAllPersons={setAllPersons}
        setActiveModal={setActiveModal}
        fetchData={fetchData}
      />

      {/* Seller Agents Section */}
      <PersonsSection
        title="Seller Agents"
        side="dhinac1"
        role="agents"
        buttonText="+ Add Agent"
        agreement={agreement}
        allPersons={allPersons}
        setAllPersons={setAllPersons}
        setActiveModal={setActiveModal}
        fetchData={fetchData}
        showDocumentOptions={true}
        agentDocuments={agreement.dhinac1?.agentDocuments}
        onRemoveDocument={(agent, docType) => handleRemoveAgentDocument(agent, docType, 'dhinac1')}
        onOpenLinkModal={(agent, docType, side) => { setSelectedDocType(docType); setActiveModal({type: 'linkDocument', agent, side: side || 'dhinac1'}); }}
      />

      {/* Buyers Section */}
      <PersonsSection
        title="Buyers"
        side="dhinac2"
        role="buyers"
        buttonText="+ Add Buyer"
        agreement={agreement}
        allPersons={allPersons}
        setAllPersons={setAllPersons}
        setActiveModal={setActiveModal}
        fetchData={fetchData}
      />

      {/* Buyer Agents Section */}
      <PersonsSection
        title="Buyer Agents"
        side="dhinac2"
        role="agents"
        buttonText="+ Add Agent"
        agreement={agreement}
        allPersons={allPersons}
        setAllPersons={setAllPersons}
        setActiveModal={setActiveModal}
        fetchData={fetchData}
        showDocumentOptions={true}
        agentDocuments={agreement.dhinac2?.agentDocuments}
        onRemoveDocument={(agent, docType) => handleRemoveAgentDocument(agent, docType, 'dhinac2')}
        onOpenLinkModal={(agent, docType, side) => { setSelectedDocType(docType); setActiveModal({type: 'linkDocument', agent, side: side || 'dhinac2'}); }}
      />

      {/* Witnesses Section */}
      <WitnessesSection
        agreement={agreement}
        fetchData={fetchData}
      />

      {/* Create Document Button */}
      {/* <div className="flex justify-end">
        <button
          onClick={() => setActiveModal({type: 'createDocument'})}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          + Create New Document
        </button>
      </div> */}

      {/* Document Modals */}
      <DocumentModals
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        selectedDocType={selectedDocType}
        setSelectedDocType={setSelectedDocType}
        newWakaalad={newWakaalad}
        setNewWakaalad={setNewWakaalad}
        newTasdiiq={newTasdiiq}
        setNewTasdiiq={setNewTasdiiq}
        wakaalads={wakaalads}
        tasdiiqs={tasdiiqs}
        onCreateWakaalad={handleCreateWakaalad}
        onCreateTasdiiq={handleCreateTasdiiq}
        onUpdateWakaalad={handleUpdateWakaalad}
        onDeleteWakaalad={handleDeleteWakaalad}
        onUpdateTasdiiq={handleUpdateTasdiiq}
        onDeleteTasdiiq={handleDeleteTasdiiq}
        onLinkDocument={handleAddAgentDocument}
      />
    </div>
  );
};

export default PersonsWitnesses;