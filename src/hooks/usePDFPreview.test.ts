import type { SearchPassage } from "@/api/passages";
import { TFamilyDocumentPublic, TPassage } from "@/types";

import usePDFPreview, { getHighlights } from "./usePDFPreview";

// Stands in for the Adobe SDK, which needs a real browser. Records the calls the hook
// makes so the annotation behaviour can be asserted on.
const adobe = vi.hoisted(() => ({
  addAnnotations: vi.fn(),
  removeAnnotationsFromPDF: vi.fn(),
  registerCallback: vi.fn(),
  gotoLocation: vi.fn(),
}));

vi.mock("@/api/pdf", () => ({
  default: class {
    ready = () => Promise.resolve();
    getAdobeView = () =>
      Promise.resolve({
        registerCallback: adobe.registerCallback,
        previewFile: () =>
          Promise.resolve({
            getAPIs: () => Promise.resolve({ gotoLocation: adobe.gotoLocation }),
            getAnnotationManager: () =>
              Promise.resolve({
                setConfig: vi.fn(),
                addAnnotations: adobe.addAnnotations,
                removeAnnotationsFromPDF: adobe.removeAnnotationsFromPDF,
              }),
          }),
      });
  },
}));

const legacyPassage = (overrides: Partial<TPassage> = {}): TPassage => ({
  text_block_id: "block-1",
  // The legacy model is 1-indexed.
  text_block_page: 16,
  text: "A passage",
  // [xMin,yMin], [xMax,yMin], [xMax,yMax], [xMin,yMax]
  text_block_coords: [
    [40, 415],
    [568, 415],
    [568, 566],
    [40, 566],
  ],
  ...overrides,
});

const newPassage = (overrides: Partial<SearchPassage> = {}): SearchPassage =>
  ({
    id: "passage-1",
    text_block_id: "block-1",
    text: "A passage",
    // The v2 model is 0-indexed.
    pages: [40],
    pages_with_bounding_boxes: [
      {
        number: 40,
        bounding_boxes: [
          {
            coordinates: [
              { x: 41.9, y: 415.5 },
              { x: 568.6, y: 415.5 },
              { x: 568.6, y: 566.8 },
              { x: 41.9, y: 566.8 },
            ],
          },
        ],
      },
    ],
    ...overrides,
  }) as SearchPassage;

describe("getHighlights", () => {
  describe("the legacy Vespa model", () => {
    it("keeps the already 1-indexed page number", () => {
      expect(getHighlights([legacyPassage()])[0].pageNumber).toBe(16);
    });

    it("maps the four corners to [xMin, yMin, xMax, yMax]", () => {
      expect(getHighlights([legacyPassage()])[0].boundingBox).toEqual([40, 415, 568, 566]);
    });

    it("produces one highlight per passage, keyed by the block id", () => {
      const highlights = getHighlights([legacyPassage()]);
      expect(highlights).toHaveLength(1);
      expect(highlights[0].id).toBe("block-1");
    });

    it("skips a passage with no coordinates rather than emitting a broken box", () => {
      expect(getHighlights([legacyPassage({ text_block_coords: [] })])).toEqual([]);
    });
  });

  describe("the v2 passages model", () => {
    it("shifts the 0-indexed page number to match the viewer", () => {
      expect(getHighlights([newPassage()])[0].pageNumber).toBe(41);
    });

    it("maps the four corners to [xMin, yMin, xMax, yMax]", () => {
      expect(getHighlights([newPassage()])[0].boundingBox).toEqual([41.9, 415.5, 568.6, 566.8]);
    });

    it("emits a highlight for every box on a page", () => {
      const passage = newPassage({
        pages_with_bounding_boxes: [
          {
            number: 0,
            bounding_boxes: [
              {
                coordinates: [
                  { x: 1, y: 2 },
                  { x: 3, y: 2 },
                  { x: 3, y: 4 },
                  { x: 1, y: 4 },
                ],
              },
              {
                coordinates: [
                  { x: 5, y: 6 },
                  { x: 7, y: 6 },
                  { x: 7, y: 8 },
                  { x: 5, y: 8 },
                ],
              },
            ],
          },
        ],
      });

      const highlights = getHighlights([passage]);

      expect(highlights).toHaveLength(2);
      expect(highlights.map((highlight) => highlight.boundingBox)).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ]);
    });

    it("emits highlights across every page the passage spans", () => {
      const box = {
        coordinates: [
          { x: 1, y: 2 },
          { x: 3, y: 2 },
          { x: 3, y: 4 },
          { x: 1, y: 4 },
        ],
      };
      const passage = newPassage({
        pages_with_bounding_boxes: [
          { number: 0, bounding_boxes: [box] },
          { number: 7, bounding_boxes: [box, box] },
        ],
      });

      expect(getHighlights([passage]).map((highlight) => highlight.pageNumber)).toEqual([1, 8, 8]);
    });

    it("gives every box a distinct id, since one passage can produce many", () => {
      const box = {
        coordinates: [
          { x: 1, y: 2 },
          { x: 3, y: 2 },
          { x: 3, y: 4 },
          { x: 1, y: 4 },
        ],
      };
      const passage = newPassage({
        pages_with_bounding_boxes: [
          { number: 0, bounding_boxes: [box, box] },
          { number: 7, bounding_boxes: [box] },
        ],
      });

      const ids = getHighlights([passage]).map((highlight) => highlight.id);

      expect(new Set(ids).size).toBe(ids.length);
    });

    it("skips pages with no boxes", () => {
      expect(getHighlights([newPassage({ pages_with_bounding_boxes: [{ number: 3, bounding_boxes: [] }] })])).toEqual([]);
    });

    it("skips a passage with no page geometry at all", () => {
      expect(getHighlights([newPassage({ pages_with_bounding_boxes: [] })])).toEqual([]);
    });
  });

  it("normalises a mixed list from both models together", () => {
    const highlights = getHighlights([legacyPassage(), newPassage()]);

    expect(highlights.map((highlight) => highlight.pageNumber)).toEqual([16, 41]);
  });
});

describe("registerPassages", () => {
  const document = { cdn_object: "doc.pdf", import_id: "D1", title: "Doc" } as TFamilyDocumentPublic;

  // A passage whose single box sits on `page`, expressed 0-indexed as the API does.
  const passageOnPage = (page: number, id: string): SearchPassage =>
    newPassage({
      id,
      text_block_id: id,
      pages: [page],
      pages_with_bounding_boxes: [
        {
          number: page,
          bounding_boxes: [
            {
              coordinates: [
                { x: 1, y: 2 },
                { x: 3, y: 2 },
                { x: 3, y: 4 },
                { x: 1, y: 4 },
              ],
            },
          ],
        },
      ],
    });

  // Pages sent to addAnnotations, read back off the generated Adobe payload.
  const annotatedPages = () =>
    adobe.addAnnotations.mock.calls.flatMap((call) => call[0].map((annotation: any) => annotation.target.selector.node.index + 1));

  const firePageChange = async (pageNumber: number) => {
    const [, handler] = adobe.registerCallback.mock.calls[0];
    await handler({ type: "CURRENT_ACTIVE_PAGE", data: { pageNumber } });
  };

  beforeEach(() => {
    Object.values(adobe).forEach((mock) => mock.mockReset());
    window.AdobeDC = { View: { Enum: { CallbackType: { EVENT_LISTENER: "EVENT_LISTENER" } } } } as any;
  });

  it("registers the page-change listener only once across repeated calls", async () => {
    const preview = usePDFPreview(document, "key");

    await preview.registerPassages([passageOnPage(0, "a")]);
    await preview.registerPassages([passageOnPage(0, "a"), passageOnPage(5, "b")]);
    await preview.registerPassages([passageOnPage(0, "a"), passageOnPage(5, "b"), passageOnPage(9, "c")]);

    expect(adobe.registerCallback).toHaveBeenCalledTimes(1);
  });

  it("annotates from the latest passages, not the set the listener was created with", async () => {
    const preview = usePDFPreview(document, "key");

    await preview.registerPassages([passageOnPage(0, "a")]);
    // Page 6 (0-indexed 5) only exists in this second set.
    await preview.registerPassages([passageOnPage(0, "a"), passageOnPage(5, "b")]);
    adobe.addAnnotations.mockClear();

    await firePageChange(6);

    expect(annotatedPages()).toEqual([6]);
  });

  it("does not repeat the remove/add pair when the same page fires again", async () => {
    const preview = usePDFPreview(document, "key");
    await preview.registerPassages([passageOnPage(5, "b")]);

    await firePageChange(6);
    adobe.removeAnnotationsFromPDF.mockClear();
    adobe.addAnnotations.mockClear();

    await firePageChange(6);
    await firePageChange(6);

    expect(adobe.removeAnnotationsFromPDF).not.toHaveBeenCalled();
    expect(adobe.addAnnotations).not.toHaveBeenCalled();
  });

  it("re-annotates the same page once the passages behind it change", async () => {
    const preview = usePDFPreview(document, "key");
    await preview.registerPassages([passageOnPage(5, "b")]);
    await firePageChange(6);
    adobe.addAnnotations.mockClear();

    // A second box lands on the page the reader is already looking at.
    await preview.registerPassages([passageOnPage(5, "b"), passageOnPage(5, "c")], 6);

    expect(annotatedPages()).toEqual([6, 6]);
  });

  it("never leaves two sets of annotations on the page when updates overlap", async () => {
    // Make remove/add resolve on later ticks so concurrent updates would interleave.
    const defer = () => new Promise((resolve) => setTimeout(resolve, 0));
    adobe.removeAnnotationsFromPDF.mockImplementation(defer);
    adobe.addAnnotations.mockImplementation(defer);

    const preview = usePDFPreview(document, "key");
    // Registration renders the starting page (6), so the two pages exercised below are
    // ones it has not already drawn.
    await preview.registerPassages([passageOnPage(5, "b"), passageOnPage(8, "c"), passageOnPage(11, "d")]);
    adobe.removeAnnotationsFromPDF.mockClear();
    adobe.addAnnotations.mockClear();

    // Two page changes fired back to back, without awaiting the first.
    await Promise.all([firePageChange(9), firePageChange(12)]);

    // Each add must be preceded by its own remove, never remove/remove/add/add.
    expect(adobe.removeAnnotationsFromPDF).toHaveBeenCalledTimes(2);
    expect(adobe.addAnnotations).toHaveBeenCalledTimes(2);
    expect(adobe.addAnnotations.mock.invocationCallOrder[0]).toBeLessThan(adobe.removeAnnotationsFromPDF.mock.invocationCallOrder[1]);
  });

  it("does not move the reader when passages are refreshed", async () => {
    const preview = usePDFPreview(document, "key");
    await preview.registerPassages([passageOnPage(5, "b")]);
    adobe.gotoLocation.mockClear();

    // A second page of results arrives while the reader is part way through the document.
    await preview.registerPassages([passageOnPage(5, "b"), passageOnPage(20, "d")]);

    expect(adobe.gotoLocation).not.toHaveBeenCalled();
  });

  it("redraws the page the reader is on when passages are refreshed", async () => {
    const preview = usePDFPreview(document, "key");
    await preview.registerPassages([passageOnPage(5, "b")]);
    await firePageChange(9);
    adobe.addAnnotations.mockClear();

    // A box lands on page 9 (0-indexed 8), where the reader already is.
    await preview.registerPassages([passageOnPage(5, "b"), passageOnPage(8, "c")]);

    expect(annotatedPages()).toEqual([9]);
  });

  it("clears highlights when moving to a page that has none", async () => {
    const preview = usePDFPreview(document, "key");
    await preview.registerPassages([passageOnPage(5, "b")]);
    adobe.removeAnnotationsFromPDF.mockClear();
    adobe.addAnnotations.mockClear();

    await firePageChange(2);

    expect(adobe.removeAnnotationsFromPDF).toHaveBeenCalledTimes(1);
    expect(adobe.addAnnotations).not.toHaveBeenCalled();
  });
});
