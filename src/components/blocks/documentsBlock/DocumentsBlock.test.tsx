import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import * as nextRouterMock from "next-router-mock";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

import { DEFAULT_FEATURES } from "@/constants/features";
import { EnvConfigContext } from "@/context/EnvConfig";
import { SearchLevelContext } from "@/context/SearchLevelContext";
import { envConfig } from "@/mocks/envConfig";
import { TFamilyAttribution, TFamilyDocumentPublic, TFamilyPublic, TSearchQueryGroup } from "@/types";
import { inflateFilters } from "@/utils/filters/deflate";

import { DocumentsBlock } from "./DocumentsBlock";

vi.mock("next/router", () => nextRouterMock);

const family = {
  attribution: {} as TFamilyAttribution,
  collections: [],
  concepts: [],
  documents: [
    {
      cdn_object: "https://cdn.example.org/document.pdf",
      document_status: "published",
      events: [],
      import_id: "CCLW.document.1.1",
      slug: "a-roadmap",
      title: "Roadmap for transitioning away from fossil fuels",
    } as TFamilyDocumentPublic,
  ],
  events: [],
  geographies: [],
  import_id: "CCLW.family.1.0",
  last_updated_date: "",
  metadata: {},
  published_date: "",
  slug: "a-law",
  summary: "",
  title: "A law",
} as unknown as TFamilyPublic;

const serpFilters: TSearchQueryGroup = {
  op: "and",
  filters: [
    { field: "labels.value.id", op: "contains", value: "concept::Q1651", checked: true },
    { field: "labels.value.id", op: "contains", value: "country::DEU", checked: true },
    { field: "attributes.published_date", key: "published_date", op: "gte", value: "2021-01-01" },
  ],
};

const renderIn = (search: string) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <NuqsTestingAdapter searchParams={search} hasMemory>
      <QueryClientProvider client={queryClient}>
        <EnvConfigContext.Provider value={envConfig}>
          <SearchLevelContext value="principal">
            <DocumentsBlock family={family} features={DEFAULT_FEATURES} getCategoryText={() => "law"} languages={{}} />
          </SearchLevelContext>
        </EnvConfigContext.Provider>
      </QueryClientProvider>
    </NuqsTestingAdapter>
  );
};

describe("DocumentsBlock", () => {
  beforeEach(() => {
    nextRouterMock.default.setCurrentUrl("/_search");
  });

  it("carries only the topic filters to the document page", () => {
    const params = new URLSearchParams({ principal_filters: JSON.stringify(serpFilters) });
    renderIn(params.toString());

    const href = screen.getByRole("link", { name: "Document link" }).getAttribute("href");
    const carried = new URLSearchParams(href.split("?")[1] ?? "").get("filters");
    expect(carried).not.toBeNull();

    const filters = inflateFilters(carried);
    expect(filters).toContain("concept::Q1651");
    expect(filters).not.toContain("country::DEU");
    expect(filters).not.toContain("published_date");
  });
});
