import ViewSDKClient from "@api/pdf";
import { TPassage, TDocumentPage } from "@types";

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

export default function usePDFPreview(physicalDocument: TDocumentPage, adobeKey: string) {
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

  let viewSDKClient_CACHE = null;
  let embedApi_CACHE = null;

  const createPDFClient = async () => {
    let viewSDKClient = null;
    if (viewSDKClient_CACHE) {
      viewSDKClient = viewSDKClient_CACHE;
    } else {
      viewSDKClient = new ViewSDKClient();
      viewSDKClient_CACHE = viewSDKClient;
    }

    await viewSDKClient.ready();
    const adobeViewer = await viewSDKClient.previewFile(physicalDocument, adobeKey, "pdf-div", viewerConfig);
    const embedApi = await adobeViewer.getAPIs();
    embedApi_CACHE = embedApi;
    const annotationManagerApi = await adobeViewer.getAnnotationManager();
    annotationManagerApi.setConfig(annotationConfig);
    return {
      embedApi,
      annotationManagerApi,
    };
  };

  const passageIndexChangeHandler = async (passageIndex: number, documentPassageMatches: TPassage[]) => {
    let embedApi = embedApi_CACHE;
    if (!embedApi) {
      const { embedApi: newEmbedApi } = await createPDFClient();
      embedApi = newEmbedApi;
    }
    if (!embedApi) {
      return;
    }
    if (passageIndex === null || !documentPassageMatches[passageIndex]) {
      return;
    }
    await embedApi.gotoLocation(documentPassageMatches[passageIndex]?.text_block_page);
  };

  // Sometimes the adobe PDF viewer runs out of memory so safer to recreate the PDF client
  const documentMatchesChangeHandler = async (documentPassageMatches: TPassage[], startingPassageIndex = 0) => {
    const { annotationManagerApi } = await createPDFClient();
    if (!annotationManagerApi) {
      return;
    }
    passageIndexChangeHandler(startingPassageIndex, documentPassageMatches);
    if (documentPassageMatches.length > 0) {
      const highlights = generateHighlights(physicalDocument, documentPassageMatches);
      await annotationManagerApi.addAnnotations(highlights);
    }
    // If we ever need to remove annotations
    // await annotationManagerApi.removeAnnotationsFromPDF()
  };

  return { createPDFClient, passageIndexChangeHandler, documentMatchesChangeHandler };
}
