let routerQuery = {};
let routerUrl = "/";

export function setupMockRouter(initialUrl = "/", initialQuery = {}) {
  routerUrl = initialUrl;
  routerQuery = { ...initialQuery };
}

vi.mock("next/router", () => ({
  useRouter: () => ({
    route: routerUrl,
    pathname: routerUrl,
    get query() {
      return routerQuery;
    },
    asPath: routerUrl,
    push: vi.fn((urlObj) => {
      if (urlObj && urlObj.query) {
        routerQuery = { ...urlObj.query };
      }
      return Promise.resolve();
    }),
    replace: vi.fn(),
  }),
}));
