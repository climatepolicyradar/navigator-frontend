import { screen } from "@testing-library/react";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import { FAMILY_NEW_STUB } from "@/stubs/familyNewStub";
import { TFamilyPublic } from "@/types";

import { DocumentHead } from "./DocumentHead";

const document = { ...FAMILY_NEW_STUB.documents[0], document_role: "MAIN" };

const renderDocumentHead = (family: TFamilyPublic) =>
  renderWithAppContext(DocumentHead, {
    pageProps: {
      document,
      family,
      handleViewOtherDocsClick: () => {},
      handleViewSourceClick: () => {},
      themeConfig: { features: {} },
    },
  });

describe("DocumentHead", () => {
  it("renders without a geography breadcrumb when the family has no geographies", () => {
    const { container } = renderDocumentHead({ ...FAMILY_NEW_STUB, geographies: [] });

    expect(screen.getByRole("heading", { level: 1, name: document.title })).toBeDefined();
    expect(container.querySelector('a[href^="/geographies"]')).toBeNull();
  });

  it("renders a geography breadcrumb when the family has exactly one geography", () => {
    const geography = FAMILY_NEW_STUB.geographies[0];
    const { container } = renderDocumentHead({ ...FAMILY_NEW_STUB, geographies: [geography] });

    const link = container.querySelector(`a[href="/geographies/${geography.slug}"]`);
    expect(link).not.toBeNull();
    expect(link.textContent).toContain(geography.name);
  });

  it("renders without a geography breadcrumb when the family has multiple geographies", () => {
    const { container } = renderDocumentHead(FAMILY_NEW_STUB);

    expect(FAMILY_NEW_STUB.geographies.length).toBeGreaterThan(1);
    expect(container.querySelector('a[href^="/geographies"]')).toBeNull();
  });
});
