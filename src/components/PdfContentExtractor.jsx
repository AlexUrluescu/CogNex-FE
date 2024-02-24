import React, { useState } from "react";
import pdfjs from "pdfjs-dist/build/pdf";

const PdfContentExtractor = () => {
  const [extractedContent, setExtractedContent] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const pdfData = new Uint8Array(event.target.result);
          const loadingTask = pdfjs.getDocument({ data: pdfData });

          loadingTask.promise
            .then((pdf) => {
              let textContent = "";
              const numPages = pdf.numPages;
              const getPageText = (pageNum) => {
                return pdf.getPage(pageNum).then((page) => {
                  return page.getTextContent().then((content) => {
                    const pageText = content.items.map((item) => item.str);
                    return pageText.join(" ");
                  });
                });
              };

              const promises = [];
              for (let i = 1; i <= numPages; i++) {
                promises.push(getPageText(i));
              }

              Promise.all(promises).then((pageTexts) => {
                textContent = pageTexts.join(" ");
                setExtractedContent(textContent);
              });
            })
            .catch((error) => {
              console.error("Error reading PDF:", error);
            });
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error reading or extracting PDF content:", error);
      }
    }
  };

  const handleLogContent = () => {};

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleLogContent}>Log Content to Console</button>
    </div>
  );
};

export default PdfContentExtractor;
