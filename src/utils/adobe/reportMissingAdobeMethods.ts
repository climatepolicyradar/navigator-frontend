import { faro } from "@grafana/faro-web-sdk";

import { TAdobeApis } from "@/types";

/*
  Adobe serves an unversioned viewer.js and offers no way to pin a version, so the SDK can
  change under us with no deploy on our side. The methods below are the ones called at a
  distance from where the APIs are obtained, so they are checked once, at that seam.

  Deliberately not guarded with `?.` at each call site: optional chaining would turn a
  renamed method into silently missing highlights, which is the one failure nobody would
  ever report.
*/
const findMissingAdobeMethods = ({ adobeViewer, viewerApi, annotationManagerApi }: TAdobeApis): string[] =>
  (
    [
      ["adobeViewer.registerCallback", adobeViewer?.registerCallback],
      ["viewerApi.gotoLocation", viewerApi?.gotoLocation],
      ["annotationManagerApi.addAnnotations", annotationManagerApi?.addAnnotations],
      ["annotationManagerApi.removeAnnotationsFromPDF", annotationManagerApi?.removeAnnotationsFromPDF],
    ] as const
  )
    .filter(([, method]) => typeof method !== "function")
    .map(([name]) => name);

export const reportMissingAdobeMethods = (apis: TAdobeApis): void => {
  const missing = findMissingAdobeMethods(apis);
  if (missing.length === 0) return;

  faro.api?.pushError(new Error(`Adobe PDF Embed API is missing expected methods: ${missing.join(", ")}`));
};
