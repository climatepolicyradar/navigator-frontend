import { faro } from "@grafana/faro-web-sdk";

import type { ISearchPassage } from "@/api/passages";
import ViewSDKClient from "@/api/pdf";
import { DEFAULT_DOCUMENT_TITLE } from "@/constants/document";
import {
  IAdobeAnnotationManagerApi,
  IAdobeViewer,
  IAdobeViewerApi,
  TAdobeApis,
  TAdobeEvent,
  THighlight,
  TPassage,
  TFamilyDocumentPublic,
} from "@/types";
import { generateAnnotations } from "@/utils/adobe/generateAnnotations";
import { reportMissingAdobeMethods } from "@/utils/adobe/reportMissingAdobeMethods";

/*
  The viewer is fed passages from two sources with different geometry models:

  - Legacy Vespa search: `text_block_coords`, a single box per passage, on a 1-indexed
    `text_block_page`.
  - v2 `/search/passages`: `pages_with_bounding_boxes`, potentially many boxes spread
    over many pages, with a 0-indexed page `number`.

  Both are normalised to `THighlight` before anything else happens, so the rest of the
  hook never has to know which model a passage came from.
*/
export type TViewerPassage = TPassage | ISearchPassage;

const isNewModelPassage = (passage: TViewerPassage): passage is ISearchPassage => "pages_with_bounding_boxes" in passage;

// Both models list their four corners in the same order — top-left, top-right,
// bottom-right, bottom-left — so only the container shape and the page indexing differ.
const getPassageHighlights = (passage: TViewerPassage): THighlight[] => {
  if (isNewModelPassage(passage)) {
    return (passage.pages_with_bounding_boxes ?? []).flatMap((page) =>
      (page.bounding_boxes ?? []).flatMap((box, boxIndex) => {
        const [topLeft, topRight, bottomRight] = box.coordinates ?? [];
        if (!topLeft || !topRight || !bottomRight) return [];

        return [
          {
            // A passage can contribute several boxes, so the passage id alone would not
            // be unique across annotations.
            id: `${passage.text_block_id}-${page.number}-${boxIndex}`,
            // `number` is 0-indexed in this model.
            pageNumber: page.number + 1,
            boundingBox: [topLeft.x, topLeft.y, topRight.x, bottomRight.y] as THighlight["boundingBox"],
          },
        ];
      })
    );
  }

  const [topLeft, topRight, bottomRight] = passage.text_block_coords ?? [];
  if (!topLeft || !topRight || !bottomRight) return [];

  return [
    {
      id: passage.text_block_id,
      pageNumber: passage.text_block_page,
      boundingBox: [topLeft[0], topLeft[1], topRight[0], bottomRight[1]],
    },
  ];
};

export const getHighlights = (passages: TViewerPassage[]): THighlight[] => passages.flatMap(getPassageHighlights);

export default function usePDFPreview(physicalDocument: TFamilyDocumentPublic, adobeKey: string) {
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
  let adobeViewerMemo: IAdobeViewer;
  let viewerApiMemo: IAdobeViewerApi;
  let annotationManagerApiMemo: IAdobeAnnotationManagerApi;

  // The page-change listener is registered once and reads the highlights from here, so
  // that a new set of passages does not require a second listener. `highlightsVersion`
  // changes whenever they do, and is what makes the de-duplication below page-accurate.
  let currentHighlights: THighlight[] = [];
  let highlightsVersion = 0;
  let hasRegisteredCallback = false;
  // The (highlights, page) pair last pushed to the SDK, and the page it referred to.
  let renderedKey: string | null = null;
  let renderedPage: number | null = null;
  // Annotation updates are serialised through this. Each is a remove-then-add pair, and
  // two running concurrently interleave as remove/remove/add/add, which leaves both sets
  // drawn on top of each other.
  let annotationQueue: Promise<void> = Promise.resolve();

  const getAdobeApis = async (): Promise<TAdobeApis> => {
    const viewSDKClient = new ViewSDKClient();
    await viewSDKClient.ready();
    // The one place the untyped SDK crosses into typed code. `getAdobeView` comes from
    // plain JS, so this annotation is an unchecked assertion — hence the runtime check below.
    const adobeViewer: IAdobeViewer = await viewSDKClient.getAdobeView(physicalDocument, adobeKey, "pdf-div");
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
          fileName: physicalDocument.title || DEFAULT_DOCUMENT_TITLE,
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

    const apis = {
      adobeViewer,
      viewerApi,
      annotationManagerApi,
    };
    reportMissingAdobeMethods(apis);

    return apis;
  };

  // Changes the page of the pdf reader to the page number provided
  const changePage = async (pageNumber: number) => {
    let viewerApi = viewerApiMemo;
    if (!viewerApiMemo) {
      const { viewerApi: newViewApi } = await getAdobeApis();
      viewerApi = newViewApi;
    }
    await viewerApi.gotoLocation(pageNumber);
  };

  // Removes existing highlights before adding the ones that fall on the given page.
  // Only ever holding one page's worth of annotations is deliberate — the Adobe SDK
  // degrades badly when a document carries a large number of them.
  const applyAnnotationsForPage = async (pageNumber: number) => {
    let annotationManagerApi = annotationManagerApiMemo;
    if (!annotationManagerApiMemo) {
      const { annotationManagerApi: newAnnotationManagerApi } = await getAdobeApis();
      annotationManagerApi = newAnnotationManagerApi;
    }
    if (!annotationManagerApi) {
      return;
    }

    // CURRENT_ACTIVE_PAGE fires repeatedly for the same page, and the remove/add pair is
    // the expensive part, so identical work is skipped. Checked here rather than when the
    // update is queued, so it sees what actually reached the SDK.
    const key = `${highlightsVersion}:${pageNumber}`;
    if (key === renderedKey) {
      return;
    }
    renderedKey = key;
    renderedPage = pageNumber;

    const pageHighlights = currentHighlights.filter((highlight) => highlight.pageNumber === pageNumber);
    try {
      // Clear annotations before adding provided ones
      await annotationManagerApi.removeAnnotationsFromPDF();
      if (pageHighlights.length > 0) {
        // Generate highlights for the provided passages
        const annotations = generateAnnotations(physicalDocument, pageHighlights);
        await annotationManagerApi.addAnnotations(annotations);
      }
    } catch (error) {
      // Whatever is on the page is now unknown, so let the next attempt redo this page
      // rather than trusting the cache.
      renderedKey = null;
      throw error;
    }
  };

  // Queues an annotation update behind any still in flight. Without this the remove/add
  // pairs of two overlapping updates interleave and both sets stay on the page.
  const addAnnotationsForPage = (pageNumber: number): Promise<void> => {
    annotationQueue = annotationQueue
      .then(() => applyAnnotationsForPage(pageNumber))
      // Swallowed so one failure does not stall every later update, but reported
      .catch((error: unknown) => {
        faro.api?.pushError(error instanceof Error ? error : new Error(String(error)));
      });
    return annotationQueue;
  };

  // Takes a new set of passages, shows the ones on the starting page, and makes sure a
  // page-change listener is in place to swap the highlights as the reader navigates.
  const registerPassages = async (documentPassageMatches: TViewerPassage[], startingPageNumber?: number) => {
    // A passage can carry boxes on more than one page, so highlights are flattened first
    // and the page filtering works off those rather than off the passages.
    currentHighlights = getHighlights(documentPassageMatches);
    highlightsVersion += 1;
    // Ensure we either start on the page passed in, or the page of the first highlight, or default to first page
    const startingPage = startingPageNumber || currentHighlights[0]?.pageNumber || 1;

    let adobeViewer = adobeViewerMemo;
    if (!adobeViewer || !annotationManagerApiMemo) {
      const { adobeViewer: newAdobeViewer } = await getAdobeApis();
      adobeViewer = newAdobeViewer;
    }
    if (!adobeViewer) {
      return;
    }

    // Only the first call moves the reader. Later calls are highlight refreshes — another
    // page of results arriving — and navigating on those would drag the view away from
    // wherever the reader had got to, as well as racing the page-change event.
    // Read and claimed together, with no await between, so concurrent calls cannot both
    // believe they are the first.
    const isFirstRegistration = !hasRegisteredCallback;
    hasRegisteredCallback = true;

    if (isFirstRegistration) {
      // Open the viewer on the page of the first passage highlight
      changePage(startingPage);
    }
    // Redraw whichever page is on screen using the new highlights
    await addAnnotationsForPage(isFirstRegistration ? startingPage : (renderedPage ?? startingPage));

    // Register the page-change listener exactly once per viewer. Doing it on every call
    // would stack listeners, and because each closes over the highlights it was created
    // with, whichever finished last would decide what ended up on screen.
    if (!isFirstRegistration) {
      return;
    }

    // Everytime we change page - add the highlights for that page
    // This will catch passage clicks, as well as navigation within the native pdf reader
    await adobeViewer.registerCallback(
      window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      async (event: TAdobeEvent) => {
        if (event.type === "CURRENT_ACTIVE_PAGE") {
          await addAnnotationsForPage(event.data.pageNumber);
        }
      },
      { enableFilePreviewEvents: true }
    );
  };

  return { getAdobeApis, changePage, registerPassages };
}
