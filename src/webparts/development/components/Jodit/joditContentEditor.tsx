/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type*/
/* eslint-disable no-debugger */

import * as React from "react";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import { sp } from "@pnp/pnpjs";
import * as mammoth from "mammoth";

const joditContentEditor = (context: any): JSX.Element => {
  console.log(context);
  const editor = useRef<any>(null);
  const [modal, setmodal] = useState<any>("");
  console.log(modal);

  const options = [
    "bold",
    "italic",
    "|",
    "ul",
    "ol",
    "|",
    "font",
    "fontsize",
    "|",
    "outdent",
    "indent",
    "align",
    "|",
    "hr",
    "|",
    "brush",
    "|",
    "link",
    "|",
    "undo",
    "redo",
    "spellcheck",
    "|",
    "image",
    "file",
  ];

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
      defaultLineHeight: 1.5,
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbar: true,
      toolbarAdaptive: true,
      addNewLine: false,
      uploader: {
        insertImageAsBase64URI: true,
      },

      filebrowser: {
        ajax: {
          url: "path-to-file-upload-handler",
        },
        uploader: {
          insertImageAsBase64URI: true,
          fileMaxSize: 500 * 1024,
        },
      },
      imageMaxSize: 500 * 1024, // 500KB
      fileMaxSize: 500 * 1024, // 500KB for any file
    }),
    []
  );

  // Function to fetch the .doc file from SharePoint using PnPjs
  async function fetchDocFileFromSharePoint(fileUrl: any) {
    try {
      // Fetch the file as a Blob from the SharePoint document library
      const file = await sp.web.getFileByServerRelativeUrl(fileUrl).getBlob();
      return file;
    } catch (error) {
      console.error("Error fetching the document from SharePoint:", error);
      return null;
    }
  }

  // Convert .doc file content to HTML using Mammoth.js
  async function convertDocToHtml(docBlob: any) {
    try {
      const arrayBuffer = await docBlob.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      return result.value; // HTML string of the document content
    } catch (error) {
      console.error("Error converting document to HTML:", error);
      return "";
    }
  }

  // Convert HTML content to PDF using jsPDF
  function generatePdfFromHtml(htmlContent: any) {
    const { jsPDF } = (window as any).jspdf;
    const pdfDoc = new jsPDF();

    // Add HTML content to the PDF
    pdfDoc.html(htmlContent, {
      callback: function (pdf: any) {
        pdf.save("converted-file.pdf"); // Save the PDF file
      },
      x: 10,
      y: 10,
    });
  }

  // Main function to convert a .doc file from SharePoint to PDF
  async function convertDocFileToPdf(sharepointFileUrl: any) {
    const docBlob = await fetchDocFileFromSharePoint(sharepointFileUrl);
    if (docBlob) {
      const htmlContent = await convertDocToHtml(docBlob);
      if (htmlContent) {
        generatePdfFromHtml(htmlContent);
      } else {
        console.error("Failed to convert document content");
      }
    } else {
      console.error("Failed to fetch document");
    }
  }

  return (
    <div>
      <h2>Sample</h2>
      <div>
        <JoditEditor
          ref={editor}
          value={modal.obj && modal.obj.msg}
          config={config}
          onChange={(content: any) => {
            setmodal(content);
          }}
        />
        <button
          type="button"
          onClick={() =>
            convertDocFileToPdf(
              "/sites/ReadifyEM/AllDocuments/Test Group/Sample Document.doc"
            )
          }
        >
          Download
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default joditContentEditor;
