import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { EnvConfigContext } from "@/context/EnvConfig";
import { setUpThemeConfig } from "@/mocks/api/configHandlers";
import {
  allPublishedFamiliesWithDocumentCounts,
  testCorpus1FamiliesWithSubdivisionCounts,
  testCorpus2FamiliesWithSubdivisionCounts,
} from "@/mocks/api/familiesHandlers";
import { TConfigFeatures } from "@/types";

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

    expect(result.current.data).toEqual(allPublishedFamiliesWithDocumentCounts.data);
  });

  it("only returns a list subdivision data for single default corpus in the relevant theme config", async () => {
    setUpThemeConfig({
      defaultCorpora: ["Test.corpus.n0000"],
      filters: [],
      labelVariations: [],
      links: [],
      metadata: [],
      documentCategories: [],
      defaultDocumentCategory: "All",
      features: {} as TConfigFeatures,
    });

    const queryClient = new QueryClient();

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        <EnvConfigContext.Provider value={{}}>{children}</EnvConfigContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useSubdivisions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(testCorpus1FamiliesWithSubdivisionCounts);
  });

  it("only returns a list subdivision data for multiple default corpora in the relevant theme config", async () => {
    setUpThemeConfig({
      defaultCorpora: ["Test.corpus.n0000", "Test.corpus.n0001"],
      filters: [],
      labelVariations: [],
      links: [],
      metadata: [],
      documentCategories: [],
      defaultDocumentCategory: "All",
      features: {} as TConfigFeatures,
    });

    const queryClient = new QueryClient();

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        <EnvConfigContext.Provider value={{}}>{children}</EnvConfigContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useSubdivisions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([...testCorpus1FamiliesWithSubdivisionCounts, ...testCorpus2FamiliesWithSubdivisionCounts]);
  });
});
