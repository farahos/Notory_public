import React from "react";

const AgreementPersons = ({ agreement }) => {
  const formatPersonFull = (p) => {
    if (!p) return "";
    return `${p.fullName}, ${p.nationality || ""} ah, ina ${p.motherName || ""}, 
    ku dhashay ${p.birthPlace || ""}, sannadkii ${p.birthYear || ""}, 
    deggan ${p.address || ""}, lehna ${p.documentType || ""} No. ${p.documentNumber || ""} 
    ee ku lifaaqan warqadaan, Tell: ${p.phone || ""}`;
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
        return `${i + 1}. ${formatPersonFull(agent)}\nWakiil Sharci ah (Wakaalad Ref: ${wakaaladRef})`;
      })
      .join("\n\n");

  const sellers = agreement.dhinac1?.sellers || [];
  const sellerAgents = agreement.dhinac1?.agents || [];
  const buyers = agreement.dhinac2?.buyers || [];
  const buyerAgents = agreement.dhinac2?.agents || [];

  const hasSellerAgent = sellerAgents.length > 0;
  const hasBuyerAgent = buyerAgents.length > 0;

  return (
    <div className="space-y-8">
      {/* ISKA IIBIYAHA */}
      <div className="section">
        <h2 className="section-title">ISKA IIBIYAHA:</h2>
        <div className="persons-list whitespace-pre-line">
          {formatPersonsFull(sellers)}
        </div>
        
        {hasSellerAgent && (
          <div className="mt-4">
            <h3 className="font-semibold">WAKIILKA ISKA IIBIYAHA:</h3>
            <div className="agents-list whitespace-pre-line">
              {formatAgentsFull(sellerAgents, agreement.dhinac1)}
            </div>
          </div>
        )}
      </div>

      <div className="divider"></div>

      {/* IIBSADAHA */}
      <div className="section">
        <h2 className="section-title">IIBSADAHA:</h2>
        <div className="persons-list whitespace-pre-line">
          {formatPersonsFull(buyers)}
        </div>
        
        {hasBuyerAgent && (
          <div className="mt-4">
            <h3 className="font-semibold">WAKIILKA IIBSADAHA:</h3>
            <div className="agents-list whitespace-pre-line">
              {formatAgentsFull(buyerAgents, agreement.dhinac2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgreementPersons;