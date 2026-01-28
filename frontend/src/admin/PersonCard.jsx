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
  onViewDetails, // New prop for viewing details
  showViewButton = false // Optional: control when to show view button
}) => {
  const isLinkedToThisAgent = agentDocument?.docRef;

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(person);
    }
  };

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
              {isLinkedToThisAgent && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Has {agentDocument.docType}
                </span>
              )}
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
              if (window.confirm(`Delete ${person.fullName || 'this person'}?`)) {
                onDelete();
              }
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
        {person.createdAt && (
          <div><span className="font-medium">Added:</span> {new Date(person.createdAt).toLocaleDateString()}</div>
        )}
      </div>

      {/* Document Section for Agents */}
      {showDocumentOptions && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold text-gray-700">Linked Document:</h5>
            <div className="flex gap-2">
              {!isLinkedToThisAgent ? (
                <>
                  <button
                    onClick={onLinkDocument}
                    className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700 transition"
                    title="Link Wakaalad to Agent"
                  >
                    + Link Wakaalad
                  </button>
                  <button
                    onClick={onLinkDocument}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700 transition"
                    title="Link Tasdiiq to Agent"
                  >
                    + Link Tasdiiq
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (window.confirm("Remove linked document from agent?")) {
                        onRemoveDocument();
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
                    title="Remove Document"
                  >
                    Remove Document
                  </button>
                </>
              )}
            </div>
          </div>
          
          {isLinkedToThisAgent && agentDocument && (
            <div className="bg-gray-50 p-3 rounded border">
              <div className="flex justify-between items-start">
                <div>
                  <h6 className="font-bold text-green-700">{agentDocument.docType}</h6>
                  <p className="text-sm text-gray-600">
                    Linked to this agent
                  </p>
                  {agentDocument.docRef && (
                    <div className="text-xs text-gray-500 mt-1">
                      Document ID: {agentDocument.docRef._id?.slice(-6) || agentDocument.docRef}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onLinkDocument}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="flex gap-3 mt-3 pt-3 border-t text-xs text-gray-600">
        <span className="bg-gray-100 px-2 py-1 rounded">
          Side: {side === 'dhinac1' ? 'Seller' : 'Buyer'}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          Role: {role === 'sellers' ? 'Seller' : role === 'buyers' ? 'Buyer' : role === 'agents' ? 'Agent' : 'Guarantor'}
        </span>
        {person.updatedAt && (
          <span className="bg-gray-100 px-2 py-1 rounded">
            Updated: {new Date(person.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(PersonCard);