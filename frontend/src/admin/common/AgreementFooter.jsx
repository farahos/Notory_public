import React from "react";

const AgreementFooter = ({ agreement }) => {
  const sellers = agreement.dhinac1?.sellers || [];
  const sellerAgents = agreement.dhinac1?.agents || [];
  const buyers = agreement.dhinac2?.buyers || [];
  const buyerAgents = agreement.dhinac2?.agents || [];
  const witnesses = agreement.witnesses || [];

  const hasSellerAgent = sellerAgents.length > 0;
  const hasBuyerAgent = buyerAgents.length > 0;

  return (
    <div className="space-y-8">
      {/* SAXIIXYADA */}
      <div className="section">
        <h2 className="section-title">SAXIIXYADA</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">
              {hasSellerAgent ? "SAXIIXA WAKIILKA ISKA IIBIYAHA:" : "SAXIIXA ISKA IIBIYAHA:"}
            </h3>
            <div className="signatures">
              {(hasSellerAgent ? sellerAgents : sellers).map((person, index) => (
                <div key={index} className="signature-line mt-4">
                  <div className="border-t border-black pt-2">
                    <p>{person.fullName}</p>
                    <p className="text-sm text-gray-600">Qolka Saxiixa</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              {hasBuyerAgent ? "SAXIIXA WAKIILKA IIBSADAHA:" : "SAXIIXA IIBSADAHA:"}
            </h3>
            <div className="signatures">
              {(hasBuyerAgent ? buyerAgents : buyers).map((person, index) => (
                <div key={index} className="signature-line mt-4">
                  <div className="border-t border-black pt-2">
                    <p>{person.fullName}</p>
                    <p className="text-sm text-gray-600">Qolka Saxiixa</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* MARQAATIYAASHA */}
      {witnesses.length > 0 && (
        <div className="section">
          <h2 className="section-title">MARQAATIYAASHA</h2>
          <div className="witnesses-list">
            {witnesses.map((witness, index) => (
              <div key={index} className="witness-item">
                <p>{index + 1}. {witness}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="divider"></div>

      {/* NOTARY */}
      <div className="section">
        <h2 className="section-title">SUGITAANKA NOOTAAYADA</h2>
        <div className="notary">
          <p className="font-semibold">Dr. Maxamed Cabdiraxmaan Sheekh Maxamed</p>
          <p className="text-sm text-gray-600">Nootaari Gudaha</p>
        </div>
      </div>
    </div>
  );
};

export default AgreementFooter;