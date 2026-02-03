import React from "react";

const ShareTransfer = ({ agreement, formData }) => {
  const sellers = agreement.dhinac1?.sellers || [];
  const sellerAgents = agreement.dhinac1?.agents || [];
  const buyers = agreement.dhinac2?.buyers || [];
  const buyerAgents = agreement.dhinac2?.agents || [];
  const hasSellerAgent = sellerAgents.length > 0;
  const hasBuyerAgent = buyerAgents.length > 0;

  return (
    <div className="transfer-section">
      <h2 className="section-title">Sifada SAAMIGA</h2>
      
      <div className="agreement-text whitespace-pre-line leading-relaxed">
        {`Aniga oo ah dhinaca iska iibiyaha ${hasSellerAgent ? "oo uu wakiil sharci ah u joogo kor ku xusan" : ""}, 
waxaan si rasmi ah uga iibiyey una wareejiyey dhinaca iibsadaha ${hasBuyerAgent ? "oo uu wakiil sharci ah u joogo kor ku xusan" : ""} 
shirkad/hotel/ganacsi ka kooban saamiga soo socda:

1. Magaca Shirkad/Hotel/Ganacsi: [MAGACA SHIRKAD]
2. Tirada Saamiga: [TIRADA SAAMIGA]
3. Lambarka Saamiga: [LAMBAR SAAMI]
4. Qiimaha Saamiga: [QIIMAHA SAAMI]
5. Halka uu saamigu ka yahay: [GOOBTA SHIRKADU KASOO HAWLO]

Qiimaha lagu kala iibsaday waa ${formData.sellingPrice || agreement.sellingPrice || 0}.

Milkiyadda saamiga waxay si sharci ah ugu wareegtay iibsadaha, isla markaana iibsaduhu wuxuu noqday qofka iska leh saamigan oo ku xiran shuruudaha iyo qawaaniinta dalka.

Iibsaduhu wuxuu qaatay mas'uuliyadda saamiga oo dhan lana wadaagayaa faa'iidada iyo khasaaraha shirkad/hotel/ganacsiga.`}
      </div>
    </div>
  );
};

export default ShareTransfer;