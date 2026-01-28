import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const WitnessesSection = ({ agreement, fetchData }) => {
  const [newWitness, setNewWitness] = useState("");
  const [editWitnessIndex, setEditWitnessIndex] = useState(null);
  const [editWitnessValue, setEditWitnessValue] = useState("");
  
  const witnessInputRef = useRef(null);
  const editWitnessInputRef = useRef(null);

  useEffect(() => {
    if (editWitnessIndex !== null && editWitnessInputRef.current) {
      editWitnessInputRef.current.focus();
    }
  }, [editWitnessIndex]);

  const handleWitness = async (operation, index = null) => {
    try {
      let updatedWitnesses = [...(agreement.witnesses || [])];
      
      if (operation === "add") {
        if (!newWitness.trim()) {
          toast.error("Enter witness name");
          return;
        }
        updatedWitnesses.push(newWitness);
      } else if (operation === "update") {
        if (!editWitnessValue.trim()) {
          toast.error("Enter witness name");
          return;
        }
        updatedWitnesses[index] = editWitnessValue;
      } else if (operation === "delete") {
        updatedWitnesses.splice(index, 1);
      }
      
      await axios.put(`/api/agreements/${agreement._id}`, { 
        witnesses: updatedWitnesses 
      });
      
      toast.success(`Witness ${operation}d`);
      
      if (operation === "add") {
        setNewWitness("");
      } else if (operation === "update") {
        setEditWitnessIndex(null);
        setEditWitnessValue("");
      }
      
      fetchData();
    } catch (error) {
      toast.error(`Error ${operation}ing witness`);
      fetchData();
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="font-bold text-xl mb-6">Witnesses</h3>
      <div className="mb-6">
        <div className="flex gap-3">
          <input
            ref={witnessInputRef}
            value={newWitness}
            onChange={(e) => setNewWitness(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Witness name"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newWitness.trim()) {
                handleWitness("add");
              }
            }}
          />
          <button 
            onClick={() => handleWitness("add")}
            disabled={!newWitness.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Witness
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {agreement.witnesses?.map((witness, i) => (
          <div key={i} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
            {editWitnessIndex === i ? (
              <div className="flex gap-3 flex-1">
                <input
                  ref={editWitnessInputRef}
                  value={editWitnessValue}
                  onChange={(e) => setEditWitnessValue(e.target.value)}
                  className="border border-gray-300 p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Edit witness"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editWitnessValue.trim()) {
                      handleWitness("update", i);
                    }
                  }}
                />
                <button 
                  onClick={() => handleWitness("update", i)}
                  disabled={!editWitnessValue.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  Save
                </button>
                <button 
                  onClick={() => {
                    setEditWitnessIndex(null);
                    setEditWitnessValue("");
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {i + 1}
                  </span>
                  <span className="font-medium">{witness}</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setEditWitnessIndex(i);
                      setEditWitnessValue(witness);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleWitness("delete", i)} 
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {(!agreement.witnesses || agreement.witnesses.length === 0) && (
          <p className="text-gray-500 italic text-center py-8">No witnesses added</p>
        )}
      </div>
    </div>
  );
};

export default WitnessesSection;