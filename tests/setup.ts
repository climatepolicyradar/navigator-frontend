import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup, configure } from "@testing-library/react";
import "dotenv/config";

import { server } from "./mocks/server";

expect.extend(matchers);

configure({ testIdAttribute: "data-cy" });

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = window.IntersectionObserver || (IntersectionObserverMock as unknown as typeof IntersectionObserver);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
  localStorage.clear();
});

Object.defineProperty(window, "scrollTo", {
  value: () => {},
  writable: true,
});
