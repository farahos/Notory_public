import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const AgreementInfo = ({ agreement, fetchData }) => {
  const [formData, setFormData] = useState({
    agreementDate: agreement.agreementDate?.split("T")[0] || "",
    officeFee: agreement.officeFee || "",
    sellingPrice: agreement.sellingPrice || "",
  });

  // ================= UPDATE AGREEMENT =================
  const updateAgreement = async () => {
    try {
      await axios.put(`/api/agreements/${agreement._id}`, formData);
      toast.success("Agreement updated");
      fetchData();
    } catch {
      toast.error("Error updating agreement");
    }
  };
// ================= HELPER: FORMAT ONE PERSON FULL DATA =================
const formatPersonFull = (p) => {
  if (!p) return "";

  return `${p.fullName}, ${p.nationality || ""} ah, ina ${p.motherName || ""}, 
ku dhashay ${p.birthPlace || ""}, sannadkii ${p.birthYear || ""}, 
deggan ${p.address || ""}, lehna ${p.documentType || ""} No. ${p.documentNumber || ""} 
ee ku lifaaqan warqadaan, Tell: ${p.phone || ""}`;
};

// ================= HELPER: FORMAT MULTIPLE PERSONS =================
const formatPersonsFull = (persons = []) =>
  persons.map((p, i) => `${i + 1}. ${formatPersonFull(p)}`).join("\n\n");

// ================= HELPER: FORMAT AGENTS =================
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

// ================= AGREEMENT TEXT =================
const generateAgreementText = () => {
  const sellers = agreement.dhinac1?.sellers || [];
  const sellerAgents = agreement.dhinac1?.agents || [];
  const buyers = agreement.dhinac2?.buyers || [];
  const buyerAgents = agreement.dhinac2?.agents || [];

  const hasSellerAgent = sellerAgents.length > 0;
  const hasBuyerAgent = buyerAgents.length > 0;

  return `
REF ${agreement.refNo}                    ${agreement.agreementDate}

UJEEDDO: HESHIIS KALA GADASHO ${agreement.serviceType}

Maanta oo ay taariikhdu tahay ${agreement.agreementDate}, waxaa heshiis ku wada galay:

----------------------------------------
ISKA IIBIYAHA:
${formatPersonsFull(sellers)}

${hasSellerAgent ? `\nWAKIILKA ISKA IIBIYAHA:\n${formatAgentsFull(sellerAgents, agreement.dhinac1)}\n` : ""}

----------------------------------------
IIBSADAHA:
${formatPersonsFull(buyers)}

${hasBuyerAgent ? `\nWAKIILKA IIBSADAHA:\n${formatAgentsFull(buyerAgents, agreement.dhinac2)}\n` : ""}

----------------------------------------
QODOBKA WAREEJINTA

Aniga oo ah dhinaca iska iibiyaha ${
    hasSellerAgent ? "oo uu wakiil sharci ah u joogo kor ku xusan" : ""
  }, waxaan si rasmi ah uga iibiyey una wareejiyey dhinaca iibsadaha ${
    hasBuyerAgent ? "oo uu wakiil sharci ah u joogo kor ku xusan" : ""
  }.

Qiimaha lagu kala iibsaday waa ${agreement.sellingPrice || 0}.

Milkiyadda waxay si sharci ah ugu wareegtay iibsadaha.

----------------------------------------
SAXIIXYADA

${
  hasSellerAgent
    ? `SAXIIXA WAKIILKA ISKA IIBIYAHA:\n${sellerAgents
        .map((a) => a.fullName)
        .join("\n")}`
    : `SAXIIXA ISKA IIBIYAHA:\n${sellers.map((s) => s.fullName).join("\n")}`
}

${
  hasBuyerAgent
    ? `\nSAXIIXA WAKIILKA IIBSADAHA:\n${buyerAgents
        .map((a) => a.fullName)
        .join("\n")}`
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
      <div className="bg-white shadow rounded-lg p-4">
        <button
          onClick={downloadWord}
          className="bg-green-600 text-white px-6 py-3 rounded-lg w-full"
        >
          Download Word Document
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <input type="date" value={formData.agreementDate}
            onChange={(e) => setFormData({ ...formData, agreementDate: e.target.value })}
            className="input" />

          <input type="number" value={formData.officeFee}
            onChange={(e) => setFormData({ ...formData, officeFee: e.target.value })}
            className="input" />

          <input type="number" value={formData.sellingPrice}
            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
            className="input" />
        </div>

        <button onClick={updateAgreement} className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full">
          Update Agreement
        </button>
      </div>
    </div>
  );
};

export default AgreementInfo;
