import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const AgreementInfo = ({ agreement, fetchData }) => {
  const [formData, setFormData] = useState({
    agreementDate: agreement.agreementDate?.split('T')[0] || "",
    officeFee: agreement.officeFee || "",
    sellingPrice: agreement.sellingPrice || ""
  });

  // ================= AGREEMENT UPDATE =================
  const updateAgreement = async () => {
    try {
      await axios.put(`/api/agreements/${agreement._id}`, {
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
    // Get all sellers names
    const sellersNames = agreement.dhinac1?.sellers?.map(s => s.fullName).join(", ") || "";
    const Selleragents = agreement.dhinac1?.sellers?.map(s => s.fullName).join(", ") || "";
    
    // Get all buyers names
    const buyersNames = agreement.dhinac2?.buyers?.map(b => b.fullName).join(", ") || "";
    const Buyeragents = agreement.dhinac2?.agents?.map(b => b.fullName).join(", ") || "";

    return `
REF ${agreement.refNo}        ${agreement.agreementDate}

UJEEDDO: HESHIIS KALA GADASHO ${agreement.serviceType}

Maanta oo ay taariikhdu tahay ${agreement.agreementDate}, 
waxaa heshiis ah:

ISKA IIBIYAHA
${sellersNames}
${Selleragents}

IIBSADAHA
${buyersNames}

Anigoo ah ${sellersNames}, waxa aan ka iibiyey kuna wareejiyey 
${buyersNames} leh sifooyinkan:
${Buyeragents} leh sifooyinkan:

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

  return (
    <div className="space-y-6">
      {/* Download Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-bold text-lg mb-4">Download Agreement</h3>
        <div className="flex gap-4">
          <button
            onClick={downloadWord}
            className="bg-green-600 text-white px-6 py-3 rounded-lg flex-1 hover:bg-green-700 transition"
          >
            Download Word Document
          </button>
        </div>
      </div>

      {/* Agreement Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="font-bold text-xl mb-6 border-b pb-2">Agreement Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.agreementDate}
              onChange={(e) => setFormData({...formData, agreementDate: e.target.value})}
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Office Fee</label>
            <input
              type="number"
              value={formData.officeFee}
              onChange={(e) => setFormData({...formData, officeFee: e.target.value})}
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Selling Price</label>
            <input
              type="number"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button 
          onClick={updateAgreement}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Update Agreement
        </button>
      </div>

     
    </div>
  );
};

export default AgreementInfo;