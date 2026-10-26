import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { EnvConfigContext } from "@/context/EnvConfig";
import { publishedSubdivisionsWithDocumentCounts } from "@/mocks/api/dataInHandlers";

import useSubdivisions from "./useSubdivisions";

const renderUseSubdivisions = () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {/* @ts-expect-error - a partial env config is sufficient for this hook */}
      <EnvConfigContext.Provider value={{}}>{children}</EnvConfigContext.Provider>
    </QueryClientProvider>
  );

  return renderHook(() => useSubdivisions(), { wrapper });
};

describe("useSubdivisions", () => {
  it("returns published subdivisions with bare ISO-3166-2 codes", async () => {
    const { result } = renderUseSubdivisions();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(publishedSubdivisionsWithDocumentCounts);
  });

  it("includes subdivisions only present in the data-in pipeline, such as Mexico's", async () => {
    const { result } = renderUseSubdivisions();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(expect.arrayContaining([expect.objectContaining({ code: "MX-TAB", name: "Tabasco", count: 4 })]));
  });
});
