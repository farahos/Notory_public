import React from "react";

const AgreementHeader = ({ agreement }) => {
  return (
    <div className="agreement-header">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-semibold">REF {agreement.refNo}</div>
        <div className="text-sm font-semibold">{agreement.agreementDate}</div>
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold">UJEEDDO: HESHIIS KALA GADASHO {agreement.serviceType}</h1>
        <p className="mt-2">
          Maanta oo ay taariikhdu tahay {agreement.agreementDate}, 
          waxaa heshiis ku wada galay:
        </p>
      </div>
    </div>
  );
};

export default AgreementHeader;