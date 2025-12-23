import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { EnvConfigContext } from "@/context/EnvConfig";
import { setUpThemeConfig } from "@/mocks/api/configHandlers";
import {
  allPublishedFamiliesWithDocumentCounts,
  testCorpus1FamiliesWithSubdivisionCounts,
  testCorpus2FamiliesWithSubdivisionCounts,
} from "@/mocks/api/familiesHandlers";

import useSubdivisions from "./useSubdivisions";

describe("useSubdivisions", () => {
  it("only returns a list subdivision data that has been published", async () => {
    const queryClient = new QueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
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
      ...DEFAULT_THEME_CONFIG,
      defaultCorpora: ["Test.corpus.n0000"],
    });

    const queryClient = new QueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
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
      ...DEFAULT_THEME_CONFIG,
      defaultCorpora: ["Test.corpus.n0000", "Test.corpus.n0001"],
    });

    const queryClient = new QueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        <EnvConfigContext.Provider value={{}}>{children}</EnvConfigContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useSubdivisions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([...testCorpus1FamiliesWithSubdivisionCounts, ...testCorpus2FamiliesWithSubdivisionCounts]);
  });

  it("only returns a list subdivision data for corpora in the All category if no default corpora in the relevant theme config", async () => {
    setUpThemeConfig({
      ...DEFAULT_THEME_CONFIG,
      categories: {
        label: "Category",
        options: [
          {
            label: "All",
            slug: "All",
            value: ["Test.corpus.n0000", "Test.corpus.n0001"],
          },
        ],
      },
    });

    const queryClient = new QueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
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
