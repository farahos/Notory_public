import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Footer, 
  PageNumber ,
  Header, 
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle
} from "docx";


import { saveAs } from "file-saver";
import numberToSomaliWords from "../components/numberToSomaliWords";
import logo from '../assets/Logo1.jpg'
import footerLogo from '../assets/footer.png'
const AgreementInfo = ({ agreement, fetchData }) => {
  const [formData, setFormData] = useState({
    agreementDate: agreement.agreementDate?.split("T")[0] || "",
    officeFee: agreement.officeFee || "",
    sellingPrice: agreement.sellingPrice || "",
  });
  const [showAgreementModal, setShowAgreementModal] = useState(false);
const base64ToUint8Array = (base64) => {
  const binary = atob(base64.split(",")[1]);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

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
    return `${p.fullName}, ${p.nationality || ""} ah, ina ${p.motherName || ""},ku dhashay ${p.birthPlace || ""}, sannadkii ${p.birthYear || ""},deggan ${p.address || ""},lehna ${p.documentType || ""} No. ${p.documentNumber || ""}, ee ku lifaaqan warqadaan Tell: ${p.phone || ""} `;
  };

  const formatPersonsFull = (persons = []) =>
    persons.map((p, i) => `${i + 1}. ${formatPersonFull(p)}`).join("\n\n");

  const formatAgentsFull = (agents = [], sideData = {}) =>
    agents
      .map((agent, i) => {
        const docs = sideData?.agentDocuments?.[agent._id];
        const wakaladType = docs?.wakaalad?.wakaladType 
        const refNo =  docs?.wakaalad?.refNo
        const date =  docs?.wakaalad?.date
        const kasooBaxday =  docs?.wakaalad?.kasooBaxday
        const xafiisKuYaal =  docs?.wakaalad?.xafiisKuYaal
        const saxiix1 =  docs?.wakaalad?.saxiix1
      const service = agreement.serviceRef || {};

        return `${i + 1}. ${formatPersonFull(agent)}
        haystana ${wakaladType} lambarkeedu yahay ${refNo}
        Tr. ${date?.split("T")[0]}, kana soo baxday Xafiiska Nootaayaha
         iyo Latalinta Sharciga ah ee ${kasooBaxday}, uuna saxiixay Dr.
          ${saxiix1}, kana wakiil ah iska 
          iibiyaha ${agreement.serviceType} ${agreement.dhinac1?.sellers ?.map((b) => b.fullName).join(", ")},
          kana caafimaad qaba dhanka maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin, waxaan ka qirayaa 
          markhaatiyaasha iyo nootaayaha hortooda, in aan ka iibiyey kuna wareejiyey ${agreement.dhinac2?.buyers?.map((b) => b.fullName).join(", ")},
           Saami ka mid ah Saamiyada uu ku leeyahay ${agreement.dhinac1?.sellers ?.map((b) => b.fullName).join(", ")},
           Shirkada  ${service.companyName || "N/A"}
           oo ah sida kor ku xusan, kuna cad Activity Report-ga, ${service.SaamiDate || "N/A"} Sidaa darteed,
            laga bilaabo 01/01/2026 faa'iidada iyo manfaca Saamigaan waxa ay si sharci ah ugu wareegtay 
           ${agreement.dhinac2?.buyers?.map((b) => b.fullName).join(", ")},


        `;
      })
      .join("\n\n");

      const formatBuyerAcceptance = (buyers = []) =>
  buyers
    .map(
      (b) => `

  Anigoo ah, ${b.fullName}, ${b.nationality || ""} ah, ina ${b.motherName || ""},
  ku dhashay ${b.birthPlace || ""}, sannadkii ${b.birthYear || ""},
  deggan ${b.address || ""},
  lehna ${b.documentType || ""} No. ${b.documentNumber || ""},
  ku lifaaqan warqaddaan,
  Tell: ${b.phone || ""},
  ahna beec u aqbalaha, kana caafimaad qaba maskaxda iyo jirkaba,
  cid igu qasabtayna aysan jirin,
  waxaan ku qancay iibkaan, una aqbalay
  ${(agreement.dhinac2?.buyers || []).map((s) => s.fullName).join(", ")}.
`
    )
    .join("\n\n");

  


  // ================= SERVICE DETAILS =================
 const formatServiceDetails = () => {
  const service = agreement.serviceRef;
  if (!service) return "— Adeeg lama lifaaqin heshiiskan —";
    const TIRADASaamiGA = agreement.sellingPrice * 10

  switch (agreement.serviceType) {
    case "Saami":
      return `
SIFADA SaamiGA LA IIBINAAYO:
ACCOUNT NO:  ${service.accountNumber || "N/A"}

TIRADA SaamiGA:  ${TIRADASaamiGA || "N/A"} ${numberToSomaliWords(TIRADASaamiGA || 0)} Saami

UNA DHIGANTA: ${agreement.sellingPrice} ${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah


Anigoo ah ${agreement.dhinac1?.sellers ?.map((b) => b.fullName).join(", ")}, kana caafimaad qaba dhanka maskaxda iyo jirkaba, cid igu qasabtayna aysan jirin,
 waxaan ka qirayaa markhaatiyaasha iyo nootaayaha hortooda, in aan ka iibiyey kuna wareejiyey ${agreement.dhinac2?.buyers ?.map((b) => b.fullName).join(", ")},
  Saami ka mid ah Saamiyada aan ku leeyahay  shirkadda ${service.companyName || "N/A"} oo ah sida kor
  ku xusan, kuna cad Activity Report-ga, Tr${service.SaamiDate || "N/A"}
  Sidaa darteed, laga bilaabo 01/01/2026 faa'iidada iyo manfaca Saamigaan waxa ay si sharci ah ugu wareegtay ${agreement.dhinac2?.buyers ?.map((b) => b.fullName).join(", ")},
Anigoo ah, ${agreement.dhinac2?.buyers ?.map((b) => b.fullName).join(", ")},ahna iibsadaha Saamiga, 
kana caafimaad qaba maskaxda iyo jirkaba, cid i qasabtayna aysan jirin waxaan cadeynayaa in aan ku qancay iibkaan, aqbalayna.
Wixii aan ku xusneyn halkaan waxaa loo raacayaa sida uu qabo sharciga islaamka iyo qaanuunka Dalka
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

    case "Mooto":
      return `
Ugu horeyn anigoo ah ${agreement.dhinac1?.sellers ?.map((b) => b.fullName).join(", ")},kana caafimaad qaba dhanka maskaxda iyo jirkaba,xiskayguna taam yahay, cid igu qasabtayna aysan jirin, waxa aan ka iibiyey kuna wareejiyey ${agreement.dhinac2?.buyers ?.map((b) => b.fullName).join(", ")},mooto nooceedu yahay ${service.type || "N/A"},Chessis No. ${service.chassisNo || "N/A"},modelkeedu yahay ${service.modelYear || "N/A"},midabkeedu yahay ${service.color || "N/A"},Cylinder ${service.cylinder || "N/A"},Taargo No. ${service.plateNo || "N/A"}kana soo baxday ${service.issuedByPlate || "N/A"}Tr.${service.plateIssueDate || "N/A"} wuxuu iska iibiyaha mootadaas ku milkiyay  ${service.ownershipType || "N/A"} lahaanshaha mootadalambarkiisu yahay ${service.ownershipBookNo || "N/A"}kana soo baxay ${service.issuedByPlate || "N/A"} Tr. ${service.ownershipIssueDate || "N/A"}wuxuu ku gaday mootadaas lacag dhan  ${agreement.sellingPrice} ${numberToSomaliWords(agreement.sellingPrice)} Doolarka Mareykanka ah


 Anigoo ah iibsadaha  ${agreement.dhinac2?.buyers ?.map((b) => b.fullName).join(", ")}, kana caafimaad qaba dhanka maskaxda iyo jirkaba, xiskayguna taam yahay, 
 cid igu qasabtayna aysan jirin, waxa aan aqbalay iibkaan anigoo ku qanacsan raalina ka ah .
Sidaasi darteed laga bilaabo taariikhda kor ku xusan, 
maamulkii iyo manfacii mootadaas waxay si sharci ah ugu wareegeen iibsade  ${agreement.dhinac2?.buyers ?.map((b) => b.fullName).join(", ")},
 waana beec sax ah oo waafaqsan shareecada Islaamka iyo qaanuunka dalka Soomaaliya.
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
    const service = agreement.serviceRef || {};
    const sellers = agreement.dhinac1?.sellers || [];
    const sellerAgents = agreement.dhinac1?.agents || [];
    const buyers = agreement.dhinac2?.buyers || [];
    const buyerAgents = agreement.dhinac2?.agents || [];
    const sellerGender = sellers?.[0]?.gender;
    const buyerGender  = buyers?.[0]?.gender;

    const isMultiSeller = sellers.length > 1;
    const isMultiBuyer  = buyers.length > 1;
        const roleText = (gender, isMultiple, maleSingle, femaleSingle, plural) => {
      if (isMultiple) return plural;
      return gender === "Female" ? femaleSingle : maleSingle;
    };


    const hasSellerAgent = sellerAgents.length > 0;
    const hasBuyerAgent = buyerAgents.length > 0;

    

    return `    
REF ${agreement.refNo}                  ${agreement.agreementDate?.split("T")[0]}
UJEEDDO: HESHIIS KALA GADASHO ${agreement.serviceType.toUpperCase()}
Maanta oo ay taariikhdu tahay  ${agreement.agreementDate?.split("T")[0]}, aniga oo ah Dr. Maxamed Cabdiraxmaan Sheekh Maxamed Nootaayo Boqole,xafiiskeyga ku yaal Degmada Howl-wadaag kasoo horjeedka xawaalada Taaj una dhow xarunta Hormuud ee Muqdisho Soomaaliya waxaa i hor yimid ayagoo heshiis ah:
${roleText(
  sellerGender,
  isMultiSeller,
  "ISKA IIBIYAHA",
  "ISKA IIBISADA",
  "ISKA IIBIYAASHA"
)} ${agreement.serviceType === "Mooto" ? "MOOTADA:" :
  agreement.serviceType === "Saami"   ? "SAAMIGA:" :
  agreement.serviceType === "land"  ? "DHUL"  :
  ""}
${formatPersonsFull(sellers)}
${roleText(
  buyerGender,
  isMultiBuyer,
  "IIBSADAHA",
  "IIBSATADA",
  "IIBSADAYAASHA"
)} ${agreement.serviceType === "Mooto" ? "MOOTADA:" :
  agreement.serviceType === "Saami"   ? "SAAMIGA:" :
  agreement.serviceType === "land"  ? "DHUL"  :
  ""}
${formatPersonsFull(buyers)}
${formatServiceDetails()}
${hasSellerAgent ? `\nWAKIILKA  ${roleText(
  sellerGender,
  isMultiSeller,
  "ISKA IIBIYAHA",
  "ISKA IIBISADA",
  "ISKA IIBIYAASHA"
)}
: ${agreement.serviceType}\n${formatAgentsFull(sellerAgents, agreement.dhinac1)}\n` : 
""
}
${hasBuyerAgent ? `\n BEEC U AQBALAHA:  ${roleText(
  buyerGender,
  isMultiBuyer,
  "IIBSADAHA",
  "IIBSATADA",
  "IIBSADAYAASHA"
)}

: ${agreement.serviceType}\n${formatBuyerAcceptance(buyerAgents, agreement.dhinac2)}\n` : ``
}
SAXIIXYADA
${
  hasSellerAgent
    ? `SAXIIXA WAKIIL KA ${roleText(
        sellerGender,
        isMultiSeller,
        "ISKA IIBIYAHA",
        "ISKA IIBISADA",
        "ISKA IIBIYAASHA"
      )}:
${sellerAgents.map((a) => a.fullName).join("\n")}`
    : `SAXIIXA ${roleText(
        sellerGender,
        isMultiSeller,
        "ISKA IIBIYAHA",
        "ISKA IIBISADA",
        "ISKA IIBIYAASHA"
      )}:
${sellers.map((s) => s.fullName).join("\n")}`
}
${
  hasBuyerAgent
    ? `\nSAXIIXA BEEC U AQBALAHA ${roleText(
        buyerGender,
        isMultiBuyer,
        "IIBSADAHA",
        "IIBSATADA",
        "IIBSADAYAASHA"
      )}:
${buyerAgents.map((a) => a.fullName).join("\n")}`
    : `\nSAXIIXA ${roleText(
        buyerGender,
        isMultiBuyer,
        "IIBSADAHA",
        "IIBSATADA",
        "IIBSADAYAASHA"
      )}:
${buyers.map((b) => b.fullName).join("\n")}`
}


MARQAATIYAASHA
${agreement.witnesses?.map((w, i) => `${i + 1}. ${w}`).join("\n") || ""}
SUGITAANKA NOOTAAYADA
Dr. Maxamed Cabdiraxmaan Sheekh Maxamed
`;
  }

  // ================= DOWNLOAD WORD =================
 const downloadWord = async () => {
  const text = generateAgreementText();

  // 🔹 HEADER / BODY LOGO
  const headerImgRes = await fetch(logo);
  const headerBlob = await headerImgRes.blob();

  // 🔹 FOOTER LOGO (KALE)
  const footerImgRes = await fetch(footerLogo);
  const footerBlob = await footerImgRes.blob();

  const readAsBase64 = (blob) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
    });

  const headerBase64 = await readAsBase64(headerBlob);
  const footerBase64 = await readAsBase64(footerBlob);

  const headerImageBuffer = base64ToUint8Array(headerBase64);
  const footerImageBuffer = base64ToUint8Array(footerBase64);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
                top: 500,
                right: 1440,
                bottom: 700,   // ⬅️ yaree
                left: 1440,
                footer: 200,   // ⬅️ TAN AAD U MUHIIM
            },
          },
        },

        // 🟢 FOOTER (LOGO KALE)
        footers: {
          default: new Footer({
            children: [
              // FOOTER LOGO
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
                children: [
                  new ImageRun({
                    data: footerImageBuffer,
                    type: "png",
                    transformation: {
                      width: 650,
                      height: 8,
                    },
                  }),
                ],
              }),

              // FOOTER TEXT
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "www.Nootaayoboqole.com  Mobile: 0617730000  Email: NootaayoBoqole@gmail.com",
                    font: "Times New Roman",
                    size: 20,
                  }),
                ],
              }),

              // PAGE NUMBER
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100 },
                children: [
                  new TextRun({ text: "Page ", size: 20 }),
                  PageNumber.CURRENT,
                  new TextRun({ text: " of ", size: 20 }),
                  PageNumber.TOTAL_PAGES,
                ],
              }),
            ],
          }),
        },

        // 🟢 BODY CONTENT
        children: [
          // BODY LOGO (KORE)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new ImageRun({
                data: headerImageBuffer,
                type: "png",
                transformation: {
                  width: 650,
                  height: 120,
                },
              }),
            ],
          }),

          // TEXT
          ...text.split("\n").map(
            (line) =>
              new Paragraph({
                spacing: { after: 160 },
                children: [
                  new TextRun({
                    text: line || " ",
                    font: "Times New Roman",
                    size: 24,
                  }),
                ],
              })
          ),
        ],
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
                  Updated
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