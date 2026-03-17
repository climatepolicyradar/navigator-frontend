// TODO: Add this to CI/CD pipeline
import { describe, test, vi, expect } from "vitest";

import { handler } from "./redirection";
import redirects from "./redirects.json";

vi.mock("cloudfront", () => {
  const handle = {
    get: async (key) => {
      const value = redirects.redirects.find(({ Key }) => key === Key)?.Value;
      return value;
    },
    exists: async (key) => {
      const value = redirects.redirects.find(({ Key }) => key === Key)?.Value;
      return !!value;
    },
  };
  const factory = vi.fn(() => handle);
  return { default: { kvs: factory } };
});

describe("pattern matches", () => {
  const testCases = [
    {
      input: "/case-category/clean-water-act/",
      expected: "/search?cpl=category%2Fclean+water+act",
    },
    {
      input: "/non-us-case-category/failure-to-adapt/",
      expected: "/search?cpl=category%2Ffailure+to+adapt",
    },

    /** We can't do this as we'd need to infer that there are parentheses around "nepa" i.e. "(nepa)" */
    // {
    //   input: "/principle-law/national-environmental-policy-act-nepa/",
    //   expected:
    //     "/search?cpl=principal_law%2Fnational+environmental+policy+act+%28nepa%29",
    // },

    {
      input: "/principle-law/rivers-and-harbors-act/",
      expected: "/search?cpl=principal_law%2Frivers+and+harbors+act",
    },

    /** We can't do this as we'd need to infer that there is a ":" after "management" */
    // {
    //   input:
    //     "/non-us-principle-law/national-environmental-management-air-quality-act-39-of-2004/",
    //   expected:
    //     "/search?cpl=principal_law%2FNational+Environmental+Management%3A+Air+Quality+Act+39+of+2004",
    // },

    {
      input: "/non-us-principle-law/un-convention-on-biological-diversity/",
      expected: "/search?cpl=principal_law%2Fun+convention+on+biological+diversity",
    },
    {
      input: "/non-us-jurisdiction/superior-council-of-justice-administration/",
      expected: "/search?cpl=jurisdiction%2Fsuperior+council+of+justice+administration",
    },
    {
      input: "/non-us-jurisdiction/",
      expected: "/search#tab=jurisdictions",
    },
    {
      input: "/non-us-principal-law/",
      expected: "/search#tab=principal-laws",
    },

    {
      input: "/wp-content/uploads/2025/07/Case-Bundles-2025-07-15.csv",
      expected: "https://form.jotform.com/252292116187356",
    },

    {
      input: "/wp-content/uploads/2025/07/Global-Cases-Export-2025-07-15.csv",
      expected: "https://form.jotform.com/252292116187356",
    },
  ];

  test.each(testCases)("$input => $expected", async ({ input, expected }) => {
    const response = await handler({
      request: { uri: input },
    });
    expect(response).toEqual({
      headers: {
        "cache-control": {
          value: "max-age=86400",
        },
        location: {
          value: expected,
        },
        "x-redirect-reason": {
          value: "ccc-redirection-kvs",
        },
      },
      statusCode: 301,
      statusDescription: "Moved Permanently",
    });
  });
});

describe("redirection handler", () => {
  test("does redirect a known URI", async () => {
    const response = await handler({
      request: { uri: "/us-climate-change-litigation/" },
    });

    expect(response).toEqual({
      headers: {
        "cache-control": {
          value: "max-age=86400",
        },
        location: {
          value: "/search",
        },
        "x-redirect-reason": {
          value: "ccc-redirection-kvs",
        },
      },
      statusCode: 301,
      statusDescription: "Moved Permanently",
    });
  });

  test("does not redirect an unknown URI", async () => {
    const response = await handler({
      request: { uri: "/unknown-uri/" },
    });

    expect(response).toEqual({ uri: "/unknown-uri/" });
  });

  test("redirects PDF assets to `admin.` domain", async () => {
    const response = await handler({
      request: {
        uri: "/wp-content/uploads/non-us-case-documents/2001/20010824_89365_decision.pdf",
      },
    });

    expect(response).toEqual({
      headers: {
        "cache-control": {
          value: "max-age=86400",
        },
        location: {
          value: "https://admin.climatecasechart.com/wp-content/uploads/non-us-case-documents/2001/20010824_89365_decision.pdf",
        },
        "x-redirect-reason": {
          value: "ccc-redirection-kvs",
        },
      },
      statusCode: 301,
      statusDescription: "Moved Permanently",
    });
  });

  /** we test for this - as this will generally create a redirect loop, which is not great */
  test("does not redirect the homepage", async () => {
    const response = await handler({
      request: { uri: "/" },
    });

    expect(response).toEqual({ uri: "/" });
  });
});
