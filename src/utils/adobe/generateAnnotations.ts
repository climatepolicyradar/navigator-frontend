import { TAnnotation, TFamilyDocumentPublic, THighlight } from "@/types";

export const generateAnnotations = (document: TFamilyDocumentPublic, highlights: THighlight[]): TAnnotation[] => {
  const date = new Date();
  return highlights.map(({ id, pageNumber, boundingBox: [xMin, yMin, xMax, yMax] }) => {
    return {
      "@context": ["https://www.w3.org/ns/anno.jsonld", "https://comments.acrobat.com/ns/anno.jsonld"],
      type: "Annotation",
      id,
      bodyValue: "",
      motivation: "commenting",
      target: {
        source: document.import_id,
        selector: {
          node: {
            // Adobe indexes pages from 0.
            index: pageNumber - 1,
          },
          subtype: "highlight",
          // format [Xmin, Ymin, Xmax, Ymax]
          boundingBox: [xMin, yMin, xMax, yMax],
          // format [upper-left, upper-right, lower-left, lower-right] as x,y pairs
          quadPoints: [xMin, yMin, xMax, yMin, xMin, yMax, xMax, yMax],
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
};
