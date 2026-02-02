import React from "react";

const PersonCard = ({
  person,
  index,
  side,
  role,
  showDocumentOptions = false,
  agentDocument,
  onEdit,
  onDelete,
  onRemoveDocument,
  onLinkDocument,
  onViewDetails,
  showViewButton = false,
}) => {
  // Support older shape { docType, docRef } and new shape { wakaalad, tasdiiq }
  const wakaaladRef = agentDocument?.wakaalad || (agentDocument?.docType === "Wakaalad" && agentDocument?.docRef);
  const tasdiiqRef = agentDocument?.tasdiiq || (agentDocument?.docType === "Tasdiiq" && agentDocument?.docRef);

  const handleViewDetails = () => onViewDetails && onViewDetails(person);

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-lg text-blue-600">{person.fullName}</h4>
          <div className="text-xs text-gray-500 mt-1">ID: {person._id?.slice(-6)}</div>
          {showDocumentOptions && (
            <div className="flex items-center gap-3 mt-1">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Seller Agent {index + 1}
              </span>
              {wakaaladRef && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Has Wakaalad</span>}
              {tasdiiqRef && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Has Tasdiiq</span>}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {showViewButton && onViewDetails && (
            <button 
              onClick={handleViewDetails} 
              className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition" 
              title="View Details"
            >
              View
            </button>
          )}
          <button 
            onClick={onEdit} 
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition" 
            title="Edit Person"
          >
            Edit
          </button>
          <button 
            onClick={() => { 
              if (window.confirm(`Delete ${person.fullName || 'this person'}?`)) onDelete(); 
            }} 
            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition" 
            title="Delete Person"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div><span className="font-medium">Hooyada:</span> {person.motherName || "N/A"}</div>
        <div><span className="font-medium">Phone:</span> {person.phone || "N/A"}</div>
        <div><span className="font-medium">Gender:</span> {person.gender || "N/A"}</div>
        <div><span className="font-medium">Document:</span> {person.documentType || "N/A"}</div>
        <div><span className="font-medium">Goobta Dhalashada:</span> {person.birthPlace || "N/A"}</div>
        <div><span className="font-medium">Sanadka Dhalashada:</span> {person.birthYear || "N/A"}</div>
        <div><span className="font-medium">Cinwaan:</span> {person.address || "N/A"}</div>
        <div><span className="font-medium">Qowmiyadda:</span> {person.nationality || "N/A"}</div>
        <div><span className="font-medium">Lambarka Warqadda:</span> {person.documentNumber || "N/A"}</div>
        {person.createdAt && (<div><span className="font-medium">Added:</span> {new Date(person.createdAt).toLocaleDateString()}</div>)}
      </div>

      {showDocumentOptions && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold text-gray-700">Linked Document</h5>
            <div className="flex gap-2">
              {!wakaaladRef && !tasdiiqRef ? (
                <>
                  <button 
                    onClick={() => onLinkDocument && onLinkDocument('Wakaalad')} 
                    className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700 transition" 
                    title="Link Wakaalad to Agent"
                  >
                    + Link Wakaalad
                  </button>
                  <button 
                    onClick={() => onLinkDocument && onLinkDocument('Tasdiiq')} 
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700 transition" 
                    title="Link Tasdiiq to Agent"
                  >
                    + Link Tasdiiq
                  </button>
                </>
              ) : (
                <>
                  {wakaaladRef && (
                    <button 
                      onClick={() => { 
                        if (window.confirm('Remove Wakaalad from agent?')) onRemoveDocument && onRemoveDocument('Wakaalad'); 
                      }} 
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
                    >
                      Remove Wakaalad
                    </button>
                  )}
                  {tasdiiqRef && (
                    <button 
                      onClick={() => { 
                        if (window.confirm('Remove Tasdiiq from agent?')) onRemoveDocument && onRemoveDocument('Tasdiiq'); 
                      }} 
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
                    >
                      Remove Tasdiiq
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {wakaaladRef && (
              <div className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="font-bold text-green-700">Wakaalad</h6>
                    <p className="text-sm text-gray-600">Linked to this agent</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Document ID: {typeof wakaaladRef === 'string' ? wakaaladRef.slice(-6) : wakaaladRef?._id?.slice(-6) || '—'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onLinkDocument && onLinkDocument('Wakaalad')} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Change Wakaalad
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tasdiiqRef && (
              <div className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="font-bold text-yellow-700">Tasdiiq</h6>
                    <p className="text-sm text-gray-600">Linked to this agent</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Document ID: {typeof tasdiiqRef === 'string' ? tasdiiqRef.slice(-6) : tasdiiqRef?._id?.slice(-6) || '—'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onLinkDocument && onLinkDocument('Tasdiiq')} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Change Tasdiiq
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PersonCard);