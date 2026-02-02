import React, { useState, useEffect } from "react";

const PersonModal = ({
  mode,
  personData,
  setPersonData,
  allPersons,
  onSubmit,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedExistingPerson, setSelectedExistingPerson] = useState(null);
  const [isExistingMode, setIsExistingMode] = useState(mode === "add" ? "cusub" : "update");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim() && isExistingMode === "keydsan") {
      const results = allPersons.filter(person =>
        person.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.phone?.includes(searchQuery) ||
        (person.documentNumber && person.documentNumber.includes(searchQuery))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, isExistingMode, allPersons]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isExistingMode === "keydsan" && selectedExistingPerson) {
        // Send existing person data to parent
        await onSubmit(selectedExistingPerson);
      } else {
        // Send new person data to parent
        await onSubmit(personData);
      }
    } catch (error) {
      console.error("Error submitting person:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectExistingPerson = (person) => {
    setSelectedExistingPerson(person);
    setSearchQuery(person.fullName);
    setSearchResults([]);
  };

  const handleModeChange = (mode) => {
    setIsExistingMode(mode);
    setSelectedExistingPerson(null);
    setSearchQuery("");
    setSearchResults([]);
    
    if (mode === "cusub") {
      setPersonData({
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
    }
  };

  // sanitizers to avoid rendering event objects accidentally
  const isEventObject = (v) => v && typeof v === 'object' && ('nativeEvent' in v || '_reactName' in v || ('target' in v && v.target && typeof v.target !== 'object'));
  const sanitize = (v) => (isEventObject(v) ? '' : v);
  const safePersonData = {
    ...personData,
    fullName: sanitize(personData?.fullName),
    motherName: sanitize(personData?.motherName),
    birthPlace: sanitize(personData?.birthPlace),
    birthYear: sanitize(personData?.birthYear),
    address: sanitize(personData?.address),
    nationality: sanitize(personData?.nationality),
    phone: sanitize(personData?.phone),
    gender: sanitize(personData?.gender),
    documentType: sanitize(personData?.documentType),
    documentNumber: sanitize(personData?.documentNumber),
  };
  const safeSelected = selectedExistingPerson ? {
    ...selectedExistingPerson,
    fullName: sanitize(selectedExistingPerson.fullName),
    phone: sanitize(selectedExistingPerson.phone),
    motherName: sanitize(selectedExistingPerson.motherName),
    gender: sanitize(selectedExistingPerson.gender),
    documentType: sanitize(selectedExistingPerson.documentType),
    documentNumber: sanitize(selectedExistingPerson.documentNumber),
  } : null;

  // debug: surface any event-like values that would break rendering
  useEffect(() => {
    const check = (obj, name) => {
      if (!obj || typeof obj !== 'object') return [];
      return Object.keys(obj).filter(k => isEventObject(obj[k])).map(k => `${name}.${k}`);
    };
    const issues = [];
    issues.push(...check(personData, 'personData'));
    issues.push(...check(selectedExistingPerson || {}, 'selectedExistingPerson'));
    if (issues.length) {
      console.error('PersonModal: found event-like fields before render:', issues, { personData, selectedExistingPerson });
    }
  }, [personData, selectedExistingPerson]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 w-full max-w-[600px] rounded-lg overflow-y-auto max-h-[90vh] p-6 grid grid-cols-2 gap-4">
        <div className="col-span-2 flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="font-bold text-lg">
            {mode === "add" ? "Add Person" : "Update Person"}
          </h3>
          <button 
            onClick={onClose} 
            className="text-xl hover:text-gray-600"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {mode === "add" && (
          <div className="col-span-2 flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => handleModeChange("cusub")}
              className={`flex-1 py-3 rounded-lg transition ${isExistingMode === "cusub" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Person Cusub
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("keydsan")}
              className={`flex-1 py-3 rounded-lg transition ${isExistingMode === "keydsan" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Person Keydsan
            </button>
          </div>
        )}

        {isExistingMode === "keydsan" && mode === "add" && (
          <div className="col-span-2 space-y-4">
            <label className="block text-sm font-medium mb-1">Raadi Person</label>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Geli magaca ama telefoonka"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            />
            
            {searchQuery.trim() && searchResults.length === 0 && (
              <p className="text-gray-500 text-sm">Lama helin person-ka.</p>
            )}
            
            {searchResults.length > 0 && (
              <div className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto">
                    {searchResults.map((person) => (
                  <div
                    key={person._id}
                    className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectExistingPerson(person)}
                  >
                    <div className="font-medium">{person.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {person.phone && `Tel: ${person.phone}`}
                      {person.documentNumber && ` | ID: ${person.documentNumber}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {safeSelected && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-blue-700 mb-2">Person La Doortay:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Magaca:</span> {safeSelected.fullName}</div>
                  <div><span className="font-medium">Telefoon:</span> {safeSelected.phone || "N/A"}</div>
                  <div><span className="font-medium">Hooyada:</span> {safeSelected.motherName || "N/A"}</div>
                  <div><span className="font-medium">Jinsiga:</span> {safeSelected.gender || "N/A"}</div>
                  <div><span className="font-medium">Nooca Warqadda:</span> {safeSelected.documentType || "N/A"}</div>
                  <div><span className="font-medium">Nambarka:</span> {safeSelected.documentNumber || "N/A"}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {(isExistingMode === "cusub" || mode === "update") && (
          <>
            <input
              value={safePersonData.fullName}
              onChange={(e) => setPersonData({ ...personData, fullName: e.target.value })}
              placeholder="Full Name"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
              required
            />
            <input
              value={personData.motherName}
              onChange={(e) => setPersonData({ ...personData, motherName: e.target.value })}
              placeholder="Mother's Name"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            />
            <input
              value={personData.birthPlace}
              onChange={(e) => setPersonData({ ...personData, birthPlace: e.target.value })}
              placeholder="Birth Place"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            />
            <input
              value={personData.birthYear}
              onChange={(e) => setPersonData({ ...personData, birthYear: e.target.value })}
              placeholder="Birth Year"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            />
            <input
              value={personData.address}
              onChange={(e) => setPersonData({ ...personData, address: e.target.value })}
              placeholder="Address"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            />
            <input
              value={personData.nationality}
              onChange={(e) => setPersonData({ ...personData, nationality: e.target.value })}
              placeholder="Nationality"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            />
            <input
              value={personData.phone}
              onChange={(e) => setPersonData({ ...personData, phone: e.target.value })}
              placeholder="Phone"
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            />
            <select
              value={personData.gender}
              onChange={(e) => setPersonData({ ...personData, gender: e.target.value })}
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={personData.documentType}
              onChange={(e) => setPersonData({ ...personData, documentType: e.target.value })}
              className="border border-gray-300 p-3 rounded w-full"
              disabled={isSubmitting}
            >
              <option value="Passport">Passport</option>
              <option value="ID Card">ID Card</option>
              <option value="Niira">Niira</option>
              <option value="Sugnan">Sugnan</option>
            </select>
            <input
              value={safePersonData.documentNumber}
              onChange={(e) => setPersonData({ ...personData, documentNumber: e.target.value })}
              placeholder="Document Number"
              className="border border-gray-300 p-3 rounded w-full col-span-2"
              disabled={isSubmitting}
            />
          </>
        )}

        <div className="col-span-2 flex gap-3 justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || (isExistingMode === "keydsan" && !selectedExistingPerson) || (isExistingMode === "cusub" && !personData.fullName.trim())}
          >
            {isSubmitting ? (mode === "add" ? "Adding..." : "Updating...") : (mode === "add" ? "Add Person" : "Update Person")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonModal;