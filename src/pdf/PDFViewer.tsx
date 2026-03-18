import * as pdfjsLib from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import { TDocumentPage, TPassage } from "@/types";

import { renderPage, drawHighlights, type PDFRenderState } from "./renderer";

// Configure the pdf.js worker from the installed package.
// Next.js will serve this file from node_modules automatically via its webpack config.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PDFViewerProps {
  document: TDocumentPage;
  /** Passage matches to highlight on each page */
  documentPassageMatches?: TPassage[];
  /** If set, the viewer will navigate to this page number (1-indexed) */
  pageNumber?: number;
  /** The page to show on first load */
  startingPageNumber?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PDFViewer({ document: doc, documentPassageMatches = [], pageNumber, startingPageNumber }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const highlightCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable render state that survives re-renders without causing them
  const stateRef = useRef<PDFRenderState>({
    pdfDoc: null,
    currentPage: startingPageNumber ?? 1,
    scale: 1,
    rendering: false,
    pendingPage: null,
  });

  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [currentPageDisplay, setCurrentPageDisplay] = useState(stateRef.current.currentPage);
  const [pageInput, setPageInput] = useState(String(stateRef.current.currentPage));

  // Keep a ref of the latest passage matches so callbacks always see the current value
  const passagesRef = useRef(documentPassageMatches);
  passagesRef.current = documentPassageMatches;

  // ------------------------------------------
  // Render the current page to the canvas, fitting to container width
  // ------------------------------------------
  const renderCurrentPage = useCallback(async () => {
    const canvas = canvasRef.current;
    const highlightCanvas = highlightCanvasRef.current;
    const container = containerRef.current;
    const state = stateRef.current;

    if (!state.pdfDoc || !canvas || !highlightCanvas) return;

    // Use the scroll-area width (minus some padding) so the page fits.
    const scrollArea = container?.querySelector<HTMLElement>("[data-pdf-scroll-area]");
    const containerWidth = scrollArea ? scrollArea.clientWidth - 32 : undefined;

    const pageNum = state.currentPage;
    await renderPage(state, canvas, highlightCanvas, containerWidth);

    // Draw highlights for the passages that belong to this page
    const pagePassages = passagesRef.current.filter((p) => p.text_block_page === pageNum);
    drawHighlights(highlightCanvas, state, pagePassages);

    setCurrentPageDisplay(pageNum);
    setPageInput(String(pageNum));
  }, []);

  // ------------------------------------------
  // Navigate to a specific page
  // ------------------------------------------
  const goToPage = useCallback(
    (page: number) => {
      const state = stateRef.current;
      if (!state.pdfDoc) return;
      const clamped = Math.max(1, Math.min(page, state.pdfDoc.numPages));
      state.currentPage = clamped;
      renderCurrentPage();
    },
    [renderCurrentPage]
  );

  // ------------------------------------------
  // Load the PDF document
  // ------------------------------------------
  useEffect(() => {
    if (!doc.cdn_object) return;

    let cancelled = false;
    const state = stateRef.current;

    const loadPdf = async () => {
      setLoading(true);
      const loadingTask = pdfjsLib.getDocument({ url: doc.cdn_object });
      const pdfDoc = await loadingTask.promise;

      if (cancelled) {
        pdfDoc.destroy();
        return;
      }

      state.pdfDoc = pdfDoc;
      setNumPages(pdfDoc.numPages);

      // Navigate to the starting page
      const initialPage = startingPageNumber ?? 1;
      state.currentPage = Math.max(1, Math.min(initialPage, pdfDoc.numPages));

      await renderCurrentPage();
      setLoading(false);
    };

    loadPdf();

    return () => {
      cancelled = true;
      state.pdfDoc?.destroy();
      state.pdfDoc = null;
    };
    // Only re-load when the document URL changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.cdn_object]);

  // ------------------------------------------
  // React to external page-number changes
  // ------------------------------------------
  useEffect(() => {
    if (pageNumber !== undefined && pageNumber !== null) {
      goToPage(pageNumber);
    }
  }, [pageNumber, goToPage]);

  // ------------------------------------------
  // Re-draw highlights when passages change
  // ------------------------------------------
  useEffect(() => {
    const highlightCanvas = highlightCanvasRef.current;
    const state = stateRef.current;
    if (!highlightCanvas || !state.pdfDoc) return;

    const pagePassages = documentPassageMatches.filter((p) => p.text_block_page === state.currentPage);
    drawHighlights(highlightCanvas, state, pagePassages);
  }, [documentPassageMatches]);

  // ------------------------------------------
  // Resize handler – re-render when container size changes
  // ------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (stateRef.current.pdfDoc) {
        renderCurrentPage();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [renderCurrentPage]);

  // ------------------------------------------
  // Render
  // ------------------------------------------
  return (
    <div ref={containerRef} className="relative flex h-full flex-col" data-analytics-document={doc.content_type}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <button
            className="rounded px-2 py-1 hover:bg-gray-200 disabled:opacity-40"
            disabled={currentPageDisplay <= 1}
            onClick={() => goToPage(stateRef.current.currentPage - 1)}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          <span className="flex items-center gap-1">
            Page{" "}
            <input
              type="text"
              inputMode="numeric"
              className="w-12 rounded border border-gray-300 px-1 py-0.5 text-center text-sm"
              value={pageInput}
              onChange={(e) => {
                // Only allow digits
                const raw = e.target.value.replace(/\D/g, "");
                setPageInput(raw);
              }}
              onBlur={() => {
                const parsed = parseInt(pageInput, 10);
                if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
                  goToPage(parsed);
                } else {
                  // Revert to current page on invalid input
                  setPageInput(String(currentPageDisplay));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              aria-label="Go to page"
            />{" "}
            of {numPages}
          </span>
          <button
            className="rounded px-2 py-1 hover:bg-gray-200 disabled:opacity-40"
            disabled={currentPageDisplay >= numPages}
            onClick={() => goToPage(stateRef.current.currentPage + 1)}
            aria-label="Next page"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div data-pdf-scroll-area className="relative flex-1 overflow-auto bg-gray-100">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <Loader />
          </div>
        )}
        <div className="flex justify-center py-4">
          <div className="relative max-w-full">
            {/* Main PDF page canvas */}
            <canvas ref={canvasRef} className="max-w-full shadow-lg" />
            {/* Transparent overlay canvas for passage highlights */}
            <canvas ref={highlightCanvasRef} className="pointer-events-none absolute left-0 top-0 max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
