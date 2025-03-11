import ViewSDKClient from "@/api/pdf";
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
  adobeViewer: any;
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

  const annotationConfig = { showToolbar: false, showCommentsPanel: false, downloadWithAnnotations: true, printWithAnnotations: true };

  // Memoize the Adobe Viewer API - this is used to control the viewer, e.g. change page
  let adobeViewerMemo: any;
  let viewerApiMemo: any;
  let annotationManagerApiMemo: any;

  const getAdobeApis = async (): Promise<TAdobeApis> => {
    const viewSDKClient = new ViewSDKClient();
    await viewSDKClient.ready();
    const adobeViewer = await viewSDKClient.getAdobeView(physicalDocument, adobeKey, "pdf-div");
    adobeViewerMemo = adobeViewer;
    // Preview the file (this returns the Adobe Viewer APIs)
    const adobeViewerAPI = await adobeViewer.previewFile(
      {
        content: {
          location: {
            url: physicalDocument.cdn_object,
          },
        },
        metaData: {
          fileName: physicalDocument.title,
          id: physicalDocument.import_id,
        },
      },
      viewerConfig
    );

    // Adobe viewer api
    // https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_ui/#viewer-api
    const viewerApi = await adobeViewerAPI.getAPIs();
    viewerApiMemo = viewerApi;

    // Adobe annotation manager api
    // https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_comments/#basic-apis-for-commenting
    const annotationManagerApi = await adobeViewerAPI.getAnnotationManager();
    annotationManagerApi.setConfig(annotationConfig);
    annotationManagerApiMemo = annotationManagerApi;

    return {
      adobeViewer,
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

  const addAnnotationsForPage = async (pageIndex: number, documentPassageMatches: TPassage[]) => {
    let annotationManagerApi = annotationManagerApiMemo;
    if (!annotationManagerApiMemo) {
      const { annotationManagerApi: newAnnotationManagerApi } = await getAdobeApis();
      annotationManagerApi = newAnnotationManagerApi;
    }
    if (!annotationManagerApi) {
      return;
    }
    // Clear annotations before adding more
    await annotationManagerApi.removeAnnotationsFromPDF();
    await changePage(pageIndex, documentPassageMatches);
    if (documentPassageMatches.length > 0) {
      // Only get the annotations for the current page
      const highlights = generateHighlights(physicalDocument, documentPassageMatches);
      await annotationManagerApi.addAnnotations(highlights);
    }
  };

  // Set up a new callback to listen for page changes once we have a new set of passages
  // When the page changes, we will add the annotations for that page
  const registerPassages = async (documentPassageMatches: TPassage[], startingPassageIndex = 0) => {
    let adobeViewer = adobeViewerMemo;
    if (!adobeViewer || !annotationManagerApiMemo) {
      const { adobeViewer: newAdobeViewer } = await getAdobeApis();
      adobeViewer = newAdobeViewer;
    }
    if (!adobeViewer) {
      return;
    }
    await adobeViewer.registerCallback(
      window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      async (event: any) => {
        if (event.type === "CURRENT_ACTIVE_PAGE") {
          // console.log("Current active page has changed. Adding annotations for page: ", event.data.pageNumber);
          await addAnnotationsForPage(
            event.data.pageNumber,
            documentPassageMatches.filter((passage) => passage.text_block_page === event.data.pageNumber)
          );
        }
      },
      { enableFilePreviewEvents: true }
    );
    // Set the initial page
    // Add the annotations for the initial page
    return await changePage(startingPassageIndex, documentPassageMatches);
  };

  return { getAdobeApis, changePage, registerPassages };
}
