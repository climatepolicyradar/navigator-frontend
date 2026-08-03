import { TFamilyDocumentPublic, THighlight } from "@/types";

import { generateAnnotations } from "./generateAnnotations";

const familyDocument = { cdn_object: "doc.pdf", import_id: "D1", title: "Doc" } as TFamilyDocumentPublic;

const highlight = (overrides: Partial<THighlight> = {}): THighlight => ({
  id: "block-1",
  // 1-indexed, as the viewer counts pages.
  pageNumber: 16,
  boundingBox: [40, 415, 568, 566],
  ...overrides,
});

describe("generateAnnotations", () => {
  it("produces one annotation per highlight", () => {
    const annotations = generateAnnotations(familyDocument, [highlight({ id: "a" }), highlight({ id: "b" })]);

    expect(annotations).toHaveLength(2);
    expect(annotations.map((annotation) => annotation.id)).toEqual(["a", "b"]);
  });

  it("returns nothing when there are no highlights", () => {
    expect(generateAnnotations(familyDocument, [])).toEqual([]);
  });

  it("shifts the page number down, since Adobe indexes pages from 0", () => {
    const [annotation] = generateAnnotations(familyDocument, [highlight({ pageNumber: 16 })]);

    expect(annotation.target.selector.node.index).toBe(15);
  });

  it("keeps the first page on index 0", () => {
    const [annotation] = generateAnnotations(familyDocument, [highlight({ pageNumber: 1 })]);

    expect(annotation.target.selector.node.index).toBe(0);
  });

  it("passes the bounding box through unchanged", () => {
    const [annotation] = generateAnnotations(familyDocument, [highlight({ boundingBox: [40, 415, 568, 566] })]);

    expect(annotation.target.selector.boundingBox).toEqual([40, 415, 568, 566]);
  });

  it("derives the quad points as upper-left, upper-right, lower-left, lower-right", () => {
    const [annotation] = generateAnnotations(familyDocument, [highlight({ boundingBox: [1, 2, 3, 4] })]);

    expect(annotation.target.selector.quadPoints).toEqual([1, 2, 3, 2, 1, 4, 3, 4]);
  });

  it("targets the document the highlight belongs to", () => {
    const [annotation] = generateAnnotations({ ...familyDocument, import_id: "CCLW.executive.1.2" }, [highlight()]);

    expect(annotation.target.source).toBe("CCLW.executive.1.2");
  });
});
