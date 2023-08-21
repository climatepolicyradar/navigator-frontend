import ViewSDKClient from "@api/pdf";
import { TPassage, TDocumentPage } from "@types";
import { PDF_SCROLL_DELAY } from "@constants/document";

function generateHighlights(document: TDocumentPage, documentPassageMatches: TPassage[]) {
  const date = new Date();
  return documentPassageMatches.map((passage) => {
    return {
      "@context": ["https://www.w3.org/ns/anno.jsonld", "https://comments.acrobat.com/ns/anno.jsonld"],
      type: "Annotation",
      id: passage.text_block_id,
      bodyValue: "",
      motivation: "commenting",
      target: {
        source: document.import_id,
        selector: {
          node: {
            index: passage.text_block_page - 1,
          },
          subtype: "highlight",
          // WE CAN ASSUME BLOCK_COORDS IS ALWAYS LENGTH 4
          // format [xmin, ymin, xmax, ymax]
          boundingBox: [
            passage.text_block_coords[0][0],
            passage.text_block_coords[0][1],
            passage.text_block_coords[1][0],
            passage.text_block_coords[2][1],
          ],
          // format [Xmin, Ymin, Xmax, Ymin, Xmax, Ymax, Xmin, Ymax]
          quadPoints: [
            passage.text_block_coords[0][0],
            passage.text_block_coords[0][1],
            passage.text_block_coords[1][0],
            passage.text_block_coords[0][1],
            passage.text_block_coords[0][0],
            passage.text_block_coords[2][1],
            passage.text_block_coords[1][0],
            passage.text_block_coords[2][1],
          ],
          styleClass: "body-value-css",
          type: "AdobeAnnoSelector",
          strokeColor: "#FFFF00",
          strokeWidth: 1,
          opacity: 0.25,
        },
      },
      creator: {
        type: "Person",
        name: "Climate Policy Radar",
      },
      created: date.toISOString(),
      modified: date.toISOString(),
    };
  });
}

export default function usePDFPreview(document: TDocumentPage, documentPassageMatches: TPassage[], adobeKey: string) {
  const viewerConfig = {
    showDownloadPDF: false,
    showPrintPDF: false,
    showLeftHandPanel: false,
    enableAnnotationAPIs: true,
    includePDFAnnotations: true,
    showAnnotationTools: true,
    defaultViewMode: "FIT_PAGE",
  };

  const annotationConfig = { showToolbar: false, showCommentsPanel: false, downloadWithAnnotations: true, printWithAnnotations: true };

  let viewSDKClient = null;
  let embedApi = null;

  const createPDFClient = (startingPassage: number, onLoadCallback?: Function) => {
    viewSDKClient = new ViewSDKClient();
    viewSDKClient.ready().then(() => {
      const previewFilePromise = viewSDKClient.previewFile(document, adobeKey, "pdf-div", viewerConfig);
      previewFilePromise.then((adobeViewer: any) => {
        // PDF PREVIEW -- SHOULD BE VISIBLE NOW
        adobeViewer.getAPIs().then((api: any) => {
          embedApi = api;
          // if we have a passage index, scroll to it
          if (!isNaN(Number(startingPassage))) {
            passageIndexChangeHandler(startingPassage);
          }
        });
        adobeViewer.getAnnotationManager().then((annotationManager: any) => {
          annotationManager.setConfig(annotationConfig);
          if (documentPassageMatches.length > 0) {
            annotationManager.addAnnotations(generateHighlights(document, documentPassageMatches));
          }
        });
        if (onLoadCallback) {
          onLoadCallback();
        }
      });
    });
  };

  const passageIndexChangeHandler = (passageIndex: number) => {
    if (!embedApi) {
      return;
    }
    if (passageIndex === null) return;
    setTimeout(() => {
      embedApi.gotoLocation(documentPassageMatches[passageIndex].text_block_page);
    }, PDF_SCROLL_DELAY);
  };

  return { createPDFClient, passageIndexChangeHandler };
}
