"use server";
interface PDFViewProps {
  pdfName: string ; 
}

const PDFView: React.FC<PDFViewProps> = ({ pdfName }) => {
  const absolutePdfPath = "http://localhost:3000/uploads/" + pdfName;
  console.log("Aktueller PDF-Pfad:", absolutePdfPath);

  return (
    <div className="pdf-container">
    {pdfName && (
      <object
        data={absolutePdfPath}
        type="application/pdf"
        width="100%"
        height="100%">
        <p>Ihr Browser kann diese PDF nicht anzeigen.</p>
      </object>
    )}
  </div>
  );
};

export default PDFView;
