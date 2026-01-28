import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const DocumentModals = ({
  activeModal,
  setActiveModal,
  selectedDocType,
  setSelectedDocType,
  newWakaalad,
  setNewWakaalad,
  newTasdiiq,
  setNewTasdiiq,
  wakaalads,
  tasdiiqs,
  onCreateWakaalad,
  onCreateTasdiiq,
  onUpdateWakaalad,
  onDeleteWakaalad,
  onUpdateTasdiiq,
  onDeleteTasdiiq,
  onLinkDocument
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  useEffect(() => {
    if (activeModal?.type === 'linkDocument' || activeModal?.type === 'createDocument') {
      const fetchDocuments = async () => {
        setLoading(true);
        try {
          if (selectedDocType === "Wakaalad") {
            setDocuments(wakaalads);
          } else {
            setDocuments(tasdiiqs);
          }
        } catch (err) {
          console.error("Error fetching documents:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDocuments();
    }
  }, [activeModal, selectedDocType, wakaalads, tasdiiqs]);

  const handleCreateDocument = async () => {
    setIsSubmitting(true);
    try {
      if (selectedDocType === "Wakaalad") {
        const createdDoc = await onCreateWakaalad();
        // If linking after creation and we have an agent
        if (activeModal?.agent && createdDoc) {
          await onLinkDocument(selectedDocType, createdDoc._id);
        }
      } else {
        const createdDoc = await onCreateTasdiiq();
        // If linking after creation and we have an agent
        if (activeModal?.agent && createdDoc) {
          await onLinkDocument(selectedDocType, createdDoc._id);
        }
      }
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditDocument = (doc) => {
    setEditingDoc(doc);
    setSelectedDocType(doc.wakaladType ? "Wakaalad" : "Tasdiiq");
    setShowCreateForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingDoc) return;
    setIsSubmitting(true);
    try {
      if (selectedDocType === "Wakaalad") {
        const payload = {
          wakaladType: editingDoc.wakaladType,
          refNo: editingDoc.refNo,
          date: editingDoc.date,
          kasooBaxday: editingDoc.kasooBaxday,
          xafiisKuYaal: editingDoc.xafiisKuYaal,
          saxiix1: editingDoc.saxiix1,
          saxiix2: editingDoc.saxiix2,
        };
        let updated;
        if (onUpdateWakaalad) {
          updated = await onUpdateWakaalad(editingDoc._id, payload);
        } else {
          const res = await axios.put(`/api/wakaalads/${editingDoc._id}`, payload);
          updated = res.data;
        }
        setDocuments(prev => prev.map(d => d._id === editingDoc._id ? updated : d));
        setEditingDoc(null);
        setShowCreateForm(false);
        toast.success("Wakaalad updated");
      } else {
        const payload = {
          refNo: editingDoc.refNo,
          date: editingDoc.date,
          kasooBaxday: editingDoc.kasooBaxday,
        };
        let updated;
        if (onUpdateTasdiiq) {
          updated = await onUpdateTasdiiq(editingDoc._id, payload);
        } else {
          const res = await axios.put(`/api/tasdiiqs/${editingDoc._id}`, payload);
          updated = res.data;
        }
        setDocuments(prev => prev.map(d => d._id === editingDoc._id ? updated : d));
        setEditingDoc(null);
        setShowCreateForm(false);
        toast.success("Tasdiiq updated");
      }
    } catch (err) {
      console.error("Error saving edit:", err);
      toast.error("Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDoc = async (doc) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    setIsSubmitting(true);
    try {
      if (selectedDocType === "Wakaalad") {
        if (onDeleteWakaalad) {
          await onDeleteWakaalad(doc._id);
        } else {
          await axios.delete(`/api/wakaalads/${doc._id}`);
        }
        setDocuments(prev => prev.filter(d => d._id !== doc._id));
        toast.success("Wakaalad deleted");
      } else {
        if (onDeleteTasdiiq) {
          await onDeleteTasdiiq(doc._id);
        } else {
          await axios.delete(`/api/tasdiiqs/${doc._id}`);
        }
        setDocuments(prev => prev.filter(d => d._id !== doc._id));
        toast.success("Tasdiiq deleted");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error("Failed to delete document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkDocument = (docId) => {
    onLinkDocument(selectedDocType, docId);
    setActiveModal(null);
  };

  if (!activeModal || !['linkDocument', 'createDocument'].includes(activeModal.type)) {
    return null;
  }

  if (activeModal.type === 'createDocument' || showCreateForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">{editingDoc ? `Edit ${selectedDocType}` : `Create New ${selectedDocType}`}</h3>
            <button 
              onClick={() => {
                if (showCreateForm && activeModal.agent) {
                  setShowCreateForm(false);
                } else {
                  setActiveModal(null);
                }
              }} 
              className="text-2xl hover:text-gray-600"
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-3">Select Document Type:</h4>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedDocType("Wakaalad")}
                className={`px-4 py-2 rounded-lg ${selectedDocType === "Wakaalad" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                disabled={isSubmitting}
              >
                Wakaalad
              </button>
              <button
                onClick={() => setSelectedDocType("Tasdiiq")}
                className={`px-4 py-2 rounded-lg ${selectedDocType === "Tasdiiq" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                disabled={isSubmitting}
              >
                Tasdiiq
              </button>
            </div>
          </div>

          {selectedDocType === "Wakaalad" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nooca Wakaaladda</label>
                <select
                  value={editingDoc ? editingDoc.wakaladType : newWakaalad.wakaladType}
                  onChange={(e) => {
                    if (editingDoc) setEditingDoc({...editingDoc, wakaladType: e.target.value});
                    else setNewWakaalad({...newWakaalad, wakaladType: e.target.value});
                  }}
                  className="w-full border border-gray-300 p-3 rounded"
                  disabled={isSubmitting}
                >
                  <option value="Wakaalad Guud">Wakaalad Guud</option>
                  <option value="Wakaalad Gaar">Wakaalad Gaar</option>
                  <option value="Qayim">Qayim</option>
                  <option value="DhaxalKoob">DhaxalKoob</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lambarka Tixraac</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.refNo : newWakaalad.refNo}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, refNo: e.target.value}) : setNewWakaalad({...newWakaalad, refNo: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Geli lambarka tixraac"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Taariikhda</label>
                <input
                  type="date"
                  value={editingDoc ? editingDoc.date?.slice(0,10) : newWakaalad.date}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, date: e.target.value}) : setNewWakaalad({...newWakaalad, date: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kasoo Baxday</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.kasooBaxday : newWakaalad.kasooBaxday}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, kasooBaxday: e.target.value}) : setNewWakaalad({...newWakaalad, kasooBaxday: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Halka kasoo baxday"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Xafiis Kuyaal</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.xafiisKuYaal : newWakaalad.xafiisKuYaal}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, xafiisKuYaal: e.target.value}) : setNewWakaalad({...newWakaalad, xafiisKuYaal: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Xafiiska ku yaal"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Saxiixa 1aad</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.saxiix1 : newWakaalad.saxiix1}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, saxiix1: e.target.value}) : setNewWakaalad({...newWakaalad, saxiix1: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Saxiixa koowaad"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Saxiixa 2aad</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.saxiix2 : newWakaalad.saxiix2}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, saxiix2: e.target.value}) : setNewWakaalad({...newWakaalad, saxiix2: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Saxiixa labaad"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lambarka Tixraac</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.refNo : newTasdiiq.refNo}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, refNo: e.target.value}) : setNewTasdiiq({...newTasdiiq, refNo: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Geli lambarka tixraac"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Taariikhda</label>
                <input
                  type="date"
                  value={editingDoc ? editingDoc.date?.slice(0,10) : newTasdiiq.date}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, date: e.target.value}) : setNewTasdiiq({...newTasdiiq, date: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kasoo Baxday</label>
                <input
                  type="text"
                  value={editingDoc ? editingDoc.kasooBaxday : newTasdiiq.kasooBaxday}
                  onChange={(e) => editingDoc ? setEditingDoc({...editingDoc, kasooBaxday: e.target.value}) : setNewTasdiiq({...newTasdiiq, kasooBaxday: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded"
                  placeholder="Halka kasoo baxday"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => {
                if (editingDoc) {
                  setEditingDoc(null);
                  setShowCreateForm(false);
                } else if (showCreateForm && activeModal.agent) {
                  setShowCreateForm(false);
                } else {
                  setActiveModal(null);
                }
              }}
              className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {editingDoc ? (
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : `Save ${selectedDocType}`}
              </button>
            ) : (
              <button
                onClick={handleCreateDocument}
                disabled={isSubmitting || 
                  (selectedDocType === "Wakaalad" && 
                   (!newWakaalad.refNo || !newWakaalad.date || !newWakaalad.kasooBaxday)) ||
                  (selectedDocType === "Tasdiiq" && 
                   (!newTasdiiq.refNo || !newTasdiiq.date || !newTasdiiq.kasooBaxday))
                }
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : `Create ${selectedDocType}`}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Link Document Modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Link Document to Agent</h3>
          <button 
            onClick={() => setActiveModal(null)} 
            className="text-2xl hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h4 className="font-medium mb-3">Select Document Type:</h4>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              + Create New {selectedDocType}
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedDocType("Wakaalad")}
              className={`px-4 py-2 rounded-lg ${selectedDocType === "Wakaalad" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Wakaalad
            </button>
            <button
              onClick={() => setSelectedDocType("Tasdiiq")}
              className={`px-4 py-2 rounded-lg ${selectedDocType === "Tasdiiq" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Tasdiiq
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading documents...</div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold">
                      {selectedDocType === "Wakaalad" ? `Wakaalad ${doc.refNo}` : `Tasdiiq ${doc.refNo}`}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(doc.date).toLocaleDateString()}
                    </p>
                    {doc.wakaladType && (
                      <p className="text-sm text-gray-600">Type: {doc.wakaladType}</p>
                    )}
                    <p className="text-sm text-gray-600">Issued by: {doc.kasooBaxday}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLinkDocument(doc._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Link
                    </button>
                    <button
                      onClick={() => startEditDocument(doc)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc)}
                      className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 italic mb-4">
                  No {selectedDocType.toLowerCase()}s found
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create New {selectedDocType}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentModals;