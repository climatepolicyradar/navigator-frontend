import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { EnvConfigContext } from "@/context/EnvConfig";
import { publishedFamiliesWithDocumentCounts } from "@/mocks/api/familiesHandlers";

import useSubdivisions from "./useSubdivisions";

describe("useSubdivisions", () => {
  it("only returns a list subdivision data that has been published", async () => {
    const queryClient = new QueryClient();

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        <EnvConfigContext.Provider value={{}}>{children}</EnvConfigContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useSubdivisions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(publishedFamiliesWithDocumentCounts.data);
  });
});
