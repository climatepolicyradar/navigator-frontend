import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup, configure } from "@testing-library/react";
import axios from "axios";
import "dotenv/config";

import { server } from "./mocks/server";

expect.extend(matchers);

configure({ testIdAttribute: "data-cy" });

// msw 3 lets jsdom's real XMLHttpRequest run, which enforces CORS on cross-origin
// requests. Use axios's Node http adapter so mocked API calls bypass jsdom's CORS checks.
axios.defaults.adapter = "http";

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
