/*
  Adobe's PDF Embed API ships no type definitions and there is no @types package for it, so
  these declare only the surface the PDF viewer actually uses.

  These are a hand-written promise about a runtime object, not something TypeScript can
  verify. Adobe serves an unversioned viewer.js and offers no way to pin a version, so the
  SDK can change without a deploy on our side — `findMissingAdobeMethods` in usePDFPreview
  checks the methods below at runtime for exactly that reason.

  https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/
*/

// The W3C annotation payload Adobe expects from `addAnnotations`.
export type TAnnotation = {
  "@context": string[];
  type: "Annotation";
  id: string;
  bodyValue: string;
  motivation: "commenting";
  target: {
    source: string;
    selector: {
      node: {
        index: number;
      };
      subtype: "highlight";
      boundingBox: [xMin: number, yMin: number, xMax: number, yMax: number];
      quadPoints: [xMin: number, yMin: number, xMax: number, yMin: number, xMin: number, yMax: number, xMax: number, yMax: number];
      styleClass: "body-value-css";
      type: "AdobeAnnoSelector";
      strokeColor: "#FFFF00";
      strokeWidth: 1;
      opacity: 0.25;
    };
  };
  creator: {
    type: "Person";
    name: "Climate Policy Radar";
  };
  created: string;
  modified: string;
};

// Only CURRENT_ACTIVE_PAGE is handled, but the SDK sends every file preview event through
// the same callback, so `type` stays open.
export type TAdobeEvent = {
  type: string;
  data: { pageNumber: number };
};

// https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_ui/#viewer-api
export interface IAdobeViewerApi {
  gotoLocation(pageNumber: number): Promise<void>;
}

// https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_comments/#basic-apis-for-commenting
export interface IAdobeAnnotationManagerApi {
  setConfig(config: Record<string, boolean>): Promise<void>;
  addAnnotations(annotations: TAnnotation[]): Promise<void>;
  removeAnnotationsFromPDF(): Promise<void>;
}

export interface IAdobePreviewedFile {
  getAPIs(): Promise<IAdobeViewerApi>;
  getAnnotationManager(): Promise<IAdobeAnnotationManagerApi>;
}

export interface IAdobeViewer {
  previewFile(
    file: {
      content: { location: { url: string } };
      metaData: { fileName: string; id: string };
    },
    config: Record<string, boolean | string>
  ): Promise<IAdobePreviewedFile>;
  registerCallback(type: string, callback: (event: TAdobeEvent) => void, options: { enableFilePreviewEvents: boolean }): Promise<void>;
}

export type TAdobeApis = {
  adobeViewer: IAdobeViewer;
  viewerApi: IAdobeViewerApi;
  annotationManagerApi: IAdobeAnnotationManagerApi;
};

// Custom CPR types to support Adobe SDK
export type THighlight = {
  id: string;
  // 1-indexed, matching Adobe's page events and `gotoLocation`.
  pageNumber: number;
  boundingBox: [xMin: number, yMin: number, xMax: number, yMax: number];
};
