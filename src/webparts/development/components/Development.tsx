import * as React from "react";
import type { IDevelopmentProps } from "./IDevelopmentProps";
// import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph";
// import JoditContentEditor from "./Jodit/joditContentEditor";
import * as mammoth from "mammoth";
import PDFMake from "./PDFMake/PDFMake";

export default class Development extends React.Component<
  IDevelopmentProps,
  {}
> {
  constructor(prop: IDevelopmentProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context as any,
    });
    graph.setup({
      spfxContext: this.props.context as any,
    });
  }
  public render(): React.ReactElement<IDevelopmentProps> {
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName
    // } = this.props;

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
        const result = await mammoth.convertToHtml({
          arrayBuffer: arrayBuffer,
        });
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
        {/* <JoditContentEditor context={this.props.context} /> */}
        <PDFMake />
        <button
          type="button"
          onClick={() =>
            convertDocFileToPdf(
              "https://mydomain28.sharepoint.com/sites/ReadifyEM/AllDocuments/Test%20Group/Sample%20Document.doc"
            )
          }
        >
          pdf
        </button>
      </div>
    );
  }
}
