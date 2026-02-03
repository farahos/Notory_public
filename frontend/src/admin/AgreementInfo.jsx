import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import numberToSomaliWords from "../components/numberToSomaliWords";

const AgreementInfo = ({ agreement, fetchData }) => {
  const [formData, setFormData] = useState({
    agreementDate: agreement.agreementDate?.split("T")[0] || "",
    officeFee: agreement.officeFee || "",
    sellingPrice: agreement.sellingPrice || "",
  });
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  // ================= UPDATE AGREEMENT =================
  const updateAgreement = async () => {
    try {
      await axios.put(`/api/agreements/${agreement._id}`, formData);
      toast.success("Agreement updated");
      fetchData();
      setShowAgreementModal(false);
    } catch {
      toast.error("Error updating agreement");
    }
  };

  // ================= PERSON FORMATTERS =================
  const formatPersonFull = (p) => {
    if (!p) return "";
    return `${p.fullName}, ${p.nationality || ""} ah, ina ${p.motherName || ""},
ku dhashay ${p.birthPlace || ""}, sannadkii ${p.birthYear || ""},
deggan ${p.address || ""},
lehna ${p.documentType || ""} No. ${p.documentNumber || ""},
Tell: ${p.phone || ""}`;
  };

  const formatPersonsFull = (persons = []) =>
    persons.map((p, i) => `${i + 1}. ${formatPersonFull(p)}`).join("\n\n");

  const formatAgentsFull = (agents = [], sideData = {}) =>
    agents
      .map((agent, i) => {
        const docs = sideData?.agentDocuments?.[agent._id];
        const wakaaladRef =
          docs?.wakaalad?.refNo ||
          docs?.wakaaladDetails?.refNo ||
          "Wakaalad la lifaaqay";

        return `${i + 1}. ${formatPersonFull(agent)}
Wakiil Sharci ah (Wakaalad Ref: ${wakaaladRef})`;
      })
      .join("\n\n");

  // ================= SERVICE DETAILS =================
 const formatServiceDetails = () => {
  const service = agreement.serviceRef;
  if (!service) return "— Adeeg lama lifaaqin heshiiskan —";
    const unaDhiganto = agreement.sellingPrice / 10

  switch (agreement.serviceType) {
    case "Share":
      return `
Sifada Saamiga
Shirkadda: ${service.companyName || "N/A"}
Acount ka: ${service.accountNumber || "N/A"}
Tirada Saamiga: ${agreement.sellingPrice || "N/A"} ${numberToSomaliWords(agreement.sellingPrice || 0)} doolar

Una Dhiganto: ${unaDhiganto} ${numberToSomaliWords(unaDhiganto)} doolar


Taariikhda Share-ka: ${service.shareDate || "N/A"}
`;

    case "Car":
      return `
ADEEGGA (GAARI):
Nooca: ${service.type || "N/A"}
Brand: ${service.brand || "N/A"}
Chassis No: ${service.chassisNo || "N/A"}
Engine No: ${service.engineNo || "N/A"}
Sanadka: ${service.modelYear || "N/A"}
Midabka: ${service.color || "N/A"}
Taargo: ${service.plateNo || "N/A"}
Taariikhda Taargada: ${service.plateIssueDate || "N/A"}
`;

    case "Motor":
      return `
ADEEGGA (MOTOR):
Nooca: ${service.type || "N/A"}
Chassis No: ${service.chassisNo || "N/A"}
Sanadka: ${service.modelYear || "N/A"}
Midabka: ${service.color || "N/A"}
Cylinder: ${service.cylinder || "N/A"}
Taargo: ${service.plateNo || "N/A"}
Nooca Milkiyadda: ${service.ownershipType || "N/A"}
Buug Lambar: ${service.ownershipBookNo || "N/A"}
`;

    case "Land":
      return `
ADEEGGA (DHUL):
Goobta: ${service.location || "N/A"}
Aagga: ${service.area || "N/A"}
Lambarka Dhulka: ${service.landNumber || "N/A"}
Lambarka Dhismaha: ${service.buildingNumber || "N/A"}
Deed No: ${service.deedNumber || "N/A"}
Taariikhda Deed: ${service.deedDate || "N/A"}
`;

    default:
      return "— Adeeg nooca lama garan —";
  }
};

  // ================= AGREEMENT TEXT =================
  const generateAgreementText = () => {
    const sellers = agreement.dhinac1?.sellers || [];
    const sellerAgents = agreement.dhinac1?.agents || [];
    const buyers = agreement.dhinac2?.buyers || [];
    const buyerAgents = agreement.dhinac2?.agents || [];

    const hasSellerAgent = sellerAgents.length > 0;
    const hasBuyerAgent = buyerAgents.length > 0;

    return `
REF ${agreement.refNo}                  ${agreement.agreementDate?.split("T")[0]}

UJEEDDO: HESHIIS KALA GADASHO ${agreement.serviceType}

Maanta oo ay taariikhdu tahay ${agreement.agreementDate?.split("T")[0]}, waxaa heshiis ku wada galay:



ISKA IIBIYAHA:
${formatPersonsFull(sellers)}

${hasSellerAgent ? `\nWAKIILKA ISKA IIBIYAHA:\n${formatAgentsFull(sellerAgents, agreement.dhinac1)}\n` : ""}


IIBSADAHA:
${formatPersonsFull(buyers)}

${hasBuyerAgent ? `\nWAKIILKA IIBSADAHA:\n${formatAgentsFull(buyerAgents, agreement.dhinac2)}\n` : ""}


FAAHFAAHINTA ADEEGGA
${formatServiceDetails()}




Qiimaha lagu kala iibsaday waa ${agreement.sellingPrice || 0}


Milkiyadda waxay si sharci ah ugu wareegtay iibsadaha.


SAXIIXYADA

${
  hasSellerAgent
    ? `SAXIIXA WAKIILKA ISKA IIBIYAHA:\n${sellerAgents.map((a) => a.fullName).join("\n")}`
    : `SAXIIXA ISKA IIBIYAHA:\n${sellers.map((s) => s.fullName).join("\n")}`
}

${
  hasBuyerAgent
    ? `\nSAXIIXA WAKIILKA IIBSADAHA:\n${buyerAgents.map((a) => a.fullName).join("\n")}`
    : `\nSAXIIXA IIBSADAHA:\n${buyers.map((b) => b.fullName).join("\n")}`
}

----------------------------------------
MARQAATIYAASHA
${agreement.witnesses?.map((w, i) => `${i + 1}. ${w}`).join("\n") || ""}

----------------------------------------
SUGITAANKA NOOTAAYADA
Dr. Maxamed Cabdiraxmaan Sheekh Maxamed
`;
  };

  // ================= DOWNLOAD WORD =================
  const downloadWord = async () => {
    const text = generateAgreementText();

    const doc = new Document({
      sections: [
        {
          children: text.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun({ text: line || " ", font: "Arial" })],
              })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Agreement-${agreement.refNo}.docx`);
  };

  return (
    <div className="space-y-6">
      {/* Download Button Section */}
      <div className="bg-white shadow rounded-lg p-4 flex justify-end">
        <button
          onClick={downloadWord}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Download Word Document
        </button>
      </div>

      {/* Agreement Details Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-xl">Agreement Information</h2>
            <p className="text-gray-600">Manage agreement details and pricing</p>
          </div>
          <button
            onClick={() => {
              setFormData({
                agreementDate: agreement.agreementDate?.split("T")[0] || "",
                officeFee: agreement.officeFee || "",
                sellingPrice: agreement.sellingPrice || "",
              });
              setShowAgreementModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Edit Agreement
          </button>
        </div>

        {/* Current Agreement Details Display */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className={`grid ${agreement.agreementType === "Beec" ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"} gap-6`}>
            <div>
              <p className="text-sm text-gray-500 mb-1">Agreement Date</p>
              <p className="font-medium">{agreement.agreementDate?.split("T")[0] || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Office Fee</p>
              <p className="font-medium">{agreement.officeFee ? `$${agreement.officeFee}` : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">agreement Type</p>
              <p className="font-medium">{agreement.agreementType ? `${agreement.agreementType}` : "N/A"}</p>
            </div>
            {agreement.agreementType === "Beec" && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Selling Price</p>
                <p className="font-medium">{agreement.sellingPrice ? `$${agreement.sellingPrice}` : "N/A"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agreement Update Modal */}
      {showAgreementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="font-bold text-lg">Edit Agreement</h3>
              <button 
                onClick={() => setShowAgreementModal(false)} 
                className="text-xl hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Agreement Date</label>
                  <input
                    type="date"
                    value={formData.agreementDate}
                    onChange={(e) =>
                      setFormData({ ...formData, agreementDate: e.target.value })
                    }
                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Office Fee ($)</label>
                  <input
                    type="number"
                    placeholder="Enter office fee"
                    value={formData.officeFee}
                    onChange={(e) =>
                      setFormData({ ...formData, officeFee: e.target.value })
                    }
                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {agreement.agreementType === "Beec" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Selling Price ($)</label>
                    <input
                      type="number"
                      placeholder="Enter selling price"
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, sellingPrice: e.target.value })
                      }
                      className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 justify-end mt-8">
                <button 
                  onClick={() => setShowAgreementModal(false)} 
                  className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={updateAgreement} 
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Update Agreement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementInfo;