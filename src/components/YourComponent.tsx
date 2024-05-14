import { useState } from "react";
// import pdfjs from "pdfjs-dist";

function YourComponent() {
  // const [numPages, setNumPages] = useState(null);
  // const [pdfText, setPdfText] = useState("");

  // const onDocumentLoadSuccess = ({ numPages }: any) => {
  //   setNumPages(numPages);

  //   // Extract text from each page
  //   const textPromises = [];
  //   for (let i = 1; i <= numPages; i++) {
  //     textPromises.push(
  //       pdfjs
  //         .getDocument({ url: "path/to/pdf/file.pdf" })
  //         .then((pdf: any) => pdf.getPage(i))
  //         .then((page: any) => page.getTextContent())
  //         .then((textContent: any) => {
  //           const pageText = textContent.items
  //             .map((item: any) => item.str)
  //             .join(" ");
  //           return pageText;
  //         })
  //     );
  //   }

  //   Promise.all(textPromises)
  //     .then((pageTexts) => {
  //       const extractedText = pageTexts.join(" ");
  //       setPdfText(extractedText);
  //     })
  //     .catch((error) => console.error("Failed to extract PDF text:", error));
  // };
  return (
    <div>
      {/* <Document
        file="path/to/pdf/file.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document> */}
      {/* <div>{pdfText}</div> */}
    </div>
  );
}

export default YourComponent;
