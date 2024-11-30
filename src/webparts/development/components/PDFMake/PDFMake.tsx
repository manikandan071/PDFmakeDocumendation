/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type*/
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */

import * as React from "react";
// import pdfMake from "pdfmake/build/pdfmake";
const pdfMake = require("pdfmake/build/pdfmake") as any;
// const pdfFonts = require("pdfmake/build/vfs_fonts") as any;
// import pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake") as any;
// import htmlToPdfmake from "html-to-pdfmake";

const PDFMake = (context: any): JSX.Element => {
  const convertHtmlToPdf = () => {
    const element = document.querySelector("#divToPrint"); // The HTML element you want to print

    if (element) {
      debugger;
      // Get the HTML content of the element
      const htmlContent = element.innerHTML;

      // Convert HTML to pdfMake-compatible format
      const pdfContent = htmlToPdfmake(htmlContent, {
        defaultStyles: {
          p: { fontSize: 12, margin: [0, 5, 0, 5] },
          strong: { bold: true },
        },
      });
      console.log("pdfContent", pdfContent);

      // Define the pdfMake document structure
      //   const documentDefinition = {
      //     content: pdfContent,
      //     styles: {
      //       header: {
      //         fontSize: 18,
      //         bold: true,
      //         margin: [0, 0, 0, 10],
      //       },
      //       paragraph: {
      //         fontSize: 12,
      //         margin: [0, 5, 0, 5],
      //       },
      //     },
      //     };
      const documentDefinition = {
        content: [
          { text: "1. Introduction", style: "header" },
          {
            text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            style: "paragraph",
          },
          {
            text: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
            style: "paragraph",
          },
          {
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            style: "paragraph",
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 10, 0, 10],
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5],
          },
          paragraph: {
            fontSize: 12,
            margin: [0, 5, 0, 5],
          },
          boldText: {
            fontSize: 12,
            bold: true,
            margin: [0, 5, 0, 2],
          },
        },
      };
      // Generate and open the PDF in a new tab
      pdfMake.createPdf(documentDefinition).open();
    } else {
      console.error("HTML element not found.");
    }
  };

  return (
    <div>
      <div className="paraSection" id="divToPrint">
        <h2>1. Introduction</h2>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>
        <h3>3. Definitions</h3>
        <h4>3.1. Testing Document</h4>
        <p>
          The standard chunk of Lorem Ipsum used since the 1500s is reproduced
          below for those interested.
        </p>
        <h4>3.2. Sample text one</h4>
        <p>
          The standard chunk of Lorem Ipsum used since the 1500s is reproduced
          below for those interested.
        </p>
      </div>
      <div>
        <button type="button" onClick={() => convertHtmlToPdf()}>
          Download
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default PDFMake;
