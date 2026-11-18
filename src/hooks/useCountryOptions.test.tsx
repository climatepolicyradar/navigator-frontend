import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import React from "react";

import { EnvConfigContext } from "@/context/EnvConfig";
import { server } from "@/mocks/server";

import useCountryOptions from "./useCountryOptions";

const API_URL = "https://api.test";

const node = (id: string, value: string, children: unknown[] = []) => ({
  id,
  type: id.split("::")[0],
  value,
  alternative_labels: [] as string[],
  count: 1,
  children,
});

// Countries come back nested under their region, as the search API returns ancestors with each match
const taxonomy = [
  node("region::EAS", "East Asia & Pacific", [node("country::PRK", "North Korea"), node("country::AUS", "Australia")]),
  node("region::ECS", "Europe & Central Asia", [node("country::EUR", "European Union"), node("country::FRA", "France")]),
  node("region::XAB", "International", [node("country::XAB", "International")]),
];

const renderUseCountryOptions = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {/* @ts-expect-error - a partial env config is sufficient for this hook */}
      <EnvConfigContext.Provider value={{ API_URL }}>{children}</EnvConfigContext.Provider>
    </QueryClientProvider>
  );

  return renderHook(() => useCountryOptions(), { wrapper });
};

const mockTaxonomy = () => {
  const requests: URL[] = [];
  server.use(
    http.get(`${API_URL}/search/labels\\:taxonomy`, ({ request }) => {
      requests.push(new URL(request.url));
      return HttpResponse.json({ data: taxonomy });
    })
  );
  return requests;
};

describe("useCountryOptions", () => {
  it("requests only countries from the taxonomy endpoint", async () => {
    const requests = mockTaxonomy();

    const { result } = renderUseCountryOptions();
    await waitFor(() => expect(result.current.data.length).toBeGreaterThan(0));

    expect(requests).toHaveLength(1);
    expect(requests[0].searchParams.getAll("include")).toEqual(["**/country::*"]);
  });

  it("flattens countries out of their regions, with the ISO code, slug and name", async () => {
    mockTaxonomy();

    const { result } = renderUseCountryOptions();
    await waitFor(() => expect(result.current.data.length).toBeGreaterThan(0));

    expect(result.current.data).toEqual([
      { id: "AUS", slug: "australia", display_value: "Australia" },
      { id: "FRA", slug: "france", display_value: "France" },
      { id: "PRK", slug: "korea-north", display_value: "North Korea" },
    ]);
  });

  it("leaves out system geographies that have no geography page", async () => {
    mockTaxonomy();

    const { result } = renderUseCountryOptions();
    await waitFor(() => expect(result.current.data.length).toBeGreaterThan(0));

    expect(result.current.data.map((country) => country.id)).not.toContain("EUR");
    expect(result.current.data.map((country) => country.id)).not.toContain("XAB");
  });
});
