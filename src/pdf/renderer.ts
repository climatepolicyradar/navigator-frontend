import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist";

import { TPassage } from "@/types";

// ---------------------------------------------------------------------------
// Shared render state – kept in a ref by the PDFViewer component so it
// persists across renders without triggering them.
// ---------------------------------------------------------------------------

export type PDFRenderState = {
  pdfDoc: PDFDocumentProxy | null;
  currentPage: number;
  scale: number;
  /** True while a canvas render is in progress */
  rendering: boolean;
  /** Queued page number to render once the current render finishes */
  pendingPage: number | null;
  /** The viewport used for the last render (needed to map coordinates) */
  lastViewport?: { width: number; height: number; scale: number };
};

// ---------------------------------------------------------------------------
// renderPage – draws a single PDF page onto <canvas>
// ---------------------------------------------------------------------------

let currentRenderTask: RenderTask | null = null;

/**
 * Renders a PDF page to the canvas. If `containerWidth` is provided the scale
 * is computed automatically so the page fits within that width.
 */
export async function renderPage(
  state: PDFRenderState,
  canvas: HTMLCanvasElement,
  highlightCanvas: HTMLCanvasElement,
  containerWidth?: number
): Promise<void> {
  const { pdfDoc, currentPage } = state;
  if (!pdfDoc) return;

  // If a render is already in progress, queue this page for after it finishes.
  if (state.rendering) {
    state.pendingPage = currentPage;
    return;
  }

  state.rendering = true;

  // Cancel any in-flight render to avoid "operation cancelled" errors
  if (currentRenderTask) {
    currentRenderTask.cancel();
    currentRenderTask = null;
  }

  const page: PDFPageProxy = await pdfDoc.getPage(currentPage);

  // Compute a scale that fits the page within the available container width.
  // Fall back to the scale stored in state if no container width is given.
  let scale = state.scale;
  if (containerWidth) {
    const defaultViewport = page.getViewport({ scale: 1 });
    scale = containerWidth / defaultViewport.width;
    state.scale = scale;
  }

  const viewport = page.getViewport({ scale });

  // Resize the main canvas to match the viewport
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;

  // Keep the highlight overlay the same size
  highlightCanvas.width = viewport.width;
  highlightCanvas.height = viewport.height;
  highlightCanvas.style.width = `${viewport.width}px`;
  highlightCanvas.style.height = `${viewport.height}px`;

  // Store viewport metadata so highlights can map PDF coords → canvas pixels
  state.lastViewport = {
    width: viewport.width,
    height: viewport.height,
    scale,
  };

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const renderTask = page.render({ canvasContext: ctx, canvas, viewport });
  currentRenderTask = renderTask;

  try {
    await renderTask.promise;
  } catch (err: unknown) {
    // RenderingCancelledException is expected when navigating quickly
    if (err instanceof Error && err.message?.includes("Rendering cancelled")) {
      // Silently ignore – a new render was already queued
    } else {
      throw err;
    }
  } finally {
    state.rendering = false;
    currentRenderTask = null;
  }

  // If another page was requested while we were rendering, process it now.
  if (state.pendingPage !== null) {
    const nextPage = state.pendingPage;
    state.pendingPage = null;
    state.currentPage = nextPage;
    await renderPage(state, canvas, highlightCanvas);
  }
}

// ---------------------------------------------------------------------------
// drawHighlights – paints semi-transparent rectangles over passage matches
// ---------------------------------------------------------------------------

/**
 * Draws highlight rectangles on the overlay canvas for the given passages.
 *
 * Passage coordinates are stored as `text_block_coords` which is an array of
 * four [x, y] pairs describing the bounding box corners in PDF user-space
 * units (1/72 inch, origin at bottom-left).
 *
 * Format: [[xMin, yMin], [xMax, yMin], [xMax, yMax], [xMin, yMax]]
 *
 * We map these to canvas pixel coordinates using the current viewport scale.
 */
export function drawHighlights(highlightCanvas: HTMLCanvasElement, state: PDFRenderState, passages: TPassage[]): void {
  const ctx = highlightCanvas.getContext("2d");
  if (!ctx || !state.lastViewport) return;

  const { width, height, scale } = state.lastViewport;

  // Clear previous highlights
  ctx.clearRect(0, 0, width, height);

  if (passages.length === 0) return;

  ctx.fillStyle = "rgba(255, 255, 0, 0.25)";

  for (const passage of passages) {
    const coords = passage.text_block_coords;
    if (!coords || coords.length < 4) continue;

    // coords format: [xMin, yMin], [xMax, yMin], [xMax, yMax], [xMin, yMax]
    const xMin = coords[0][0];
    const yMin = coords[0][1];
    const xMax = coords[1][0];
    const yMax = coords[2][1];

    // Convert PDF user-space coordinates to canvas pixels.
    // PDF origin is bottom-left; canvas origin is top-left, so we flip Y.
    const canvasX = xMin * scale;
    const canvasY = height - yMax * scale; // flip Y axis
    const canvasW = (xMax - xMin) * scale;
    const canvasH = (yMax - yMin) * scale;

    ctx.fillRect(canvasX, canvasY, canvasW, canvasH);
  }
}
