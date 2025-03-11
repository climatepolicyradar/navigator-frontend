import ViewSDKClient from "@api/pdf";

import { TPassage, TDocumentPage } from "@/types";

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

type TAdobeApis = {
  viewerApi: any;
  annotationManagerApi: any;
};

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

  const annotationConfig = {
    showToolbar: false,
    showCommentsPanel: false,
    downloadWithAnnotations: true,
    printWithAnnotations: true,
  };

  // Memoize the Adobe Viewer API - this is used to control the viewer, e.g. change page
  let viewerApiMemo: any;

  const getAdobeApis = async (): Promise<TAdobeApis> => {
    const viewSDKClient = new ViewSDKClient();
    await viewSDKClient.ready();
    const adobeViewer = await viewSDKClient.previewFile(physicalDocument, adobeKey, "pdf-div", viewerConfig);

    // Adobe viewer api
    // https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_ui/#viewer-api
    const viewerApi = await adobeViewer.getAPIs();
    viewerApiMemo = viewerApi;

    // Adobe annotation manager api
    // https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_comments/#basic-apis-for-commenting
    const annotationManagerApi = await adobeViewer.getAnnotationManager();
    annotationManagerApi.setConfig(annotationConfig);

    return {
      viewerApi,
      annotationManagerApi,
    };
  };

  const changePage = async (passageIndex: number, documentPassageMatches: TPassage[]) => {
    // Use the memoized viewerApi if it exists
    let viewerApi = viewerApiMemo;
    if (!viewerApiMemo) {
      const { viewerApi: newViewApi } = await getAdobeApis();
      viewerApi = newViewApi;
    }
    if (passageIndex === null || !documentPassageMatches[passageIndex]) {
      return;
    }
    await viewerApi.gotoLocation(documentPassageMatches[passageIndex]?.text_block_page);
  };

  const addAnnotations = async (documentPassageMatches: TPassage[], startingPassageIndex = 0) => {
    // Sometimes the adobe PDF viewer runs out of memory so safer to always reload the PDF viewer
    const { annotationManagerApi } = await getAdobeApis();
    if (!annotationManagerApi) {
      return;
    }
    changePage(startingPassageIndex, documentPassageMatches);
    if (documentPassageMatches.length > 0) {
      const highlights = generateHighlights(physicalDocument, documentPassageMatches);
      await annotationManagerApi.addAnnotations(highlights);
    }
    // If we ever need to remove annotations
    // await annotationManagerApi.removeAnnotationsFromPDF();
  };

  return { getAdobeApis, changePage, addAnnotations };
}
