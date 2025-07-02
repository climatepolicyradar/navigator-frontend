import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup, configure } from "@testing-library/react";

import { server } from "./mocks/server.ts";
require("dotenv").config({ path: ".env" });

expect.extend(matchers);

configure({ testIdAttribute: "data-cy" });

// Mock ResizeObserver
//
// This is used to detect changes in element dimensions that components often use to
// adjust their size e.g., tables, modals.
//
// This helps to prevent errors during tests.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;

// Mock IntersectionObserver.
//
// This is used for detecting when an element is in the viewport. This is particularly
// useful for features such as infinite scrolling, lazy loading or visibility based
// animations.
//
// This helps to prevent errors since this API is not available in the JSDOM test env.
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = window.IntersectionObserver || IntersectionObserverMock;

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Clean up after the tests are finished.
afterAll(() => {
  server.close();
  localStorage.clear();
});

Object.defineProperty(window, "scrollTo", {
  value: () => {},
  writable: true,
});
