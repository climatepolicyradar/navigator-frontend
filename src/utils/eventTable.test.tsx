import { render, screen } from "@testing-library/react";
import * as nextRouterMock from "next-router-mock";
import { vi } from "vitest";

import { TFamilyAttribution, TFamilyDocumentPublic, TFamilyPublic } from "@/types";

import { getDocumentLink, getEventTableRows } from "./eventTable";

vi.mock("next/router", () => nextRouterMock);

describe("getEventTableRows", () => {
  it("returns an empty list of document rows if there are no documents in the family", () => {
    const familyWithoutDocuments: TFamilyPublic = {
      collections: [],
      concepts: [],
      attribution: {} as TFamilyAttribution,
      documents: [],
      events: [
        {
          import_id: "Event 1",
          title: "Event 1",
          date: "2021-01-01",
          event_type: "Event",
          status: "Status",
          metadata: {
            action_taken: ["Action 1"],
            datetime_event_name: ["Datetime 1"],
            description: ["Description 1"],
            event_type: ["Event 1"],
          },
        },
      ],
      metadata: {
        id: ["Id 1"],
        case_number: ["Case 1"],
      },
      geographies: [],
      import_id: "",
      last_updated_date: "",
      summary: "",
      title: "Case 1",
      published_date: "",
      slug: "",
    };

    const eventRows = getEventTableRows({ families: [familyWithoutDocuments], isLitigation: false });

    expect(eventRows).toEqual([]);
  });

  it("returns a list of document event rows if there are documents in the family", () => {
    const familyWithoutEvents: TFamilyPublic = {
      collections: [],
      concepts: [],
      attribution: {} as TFamilyAttribution,
      documents: [
        {
          import_id: "Document 1",
          slug: "document-1",
          title: "Document 1",
          events: [
            {
              import_id: "Event 1",
              title: "Event 1",
              date: "2021-01-01",
              event_type: "Event",
              status: "Status",
              metadata: {
                action_taken: ["Action 1"],
                datetime_event_name: ["Datetime 1"],
                description: ["Description 1"],
                event_type: ["Event 1"],
              },
            },
          ],
        } as TFamilyDocumentPublic,
      ],
      events: [],
      metadata: {
        id: ["Id 1"],
        case_number: ["Case 1"],
      },
      geographies: [],
      import_id: "",
      last_updated_date: "",
      summary: "",
      title: "Case 1",
      published_date: "",
      slug: "",
    };

    const eventRows = getEventTableRows({ families: [familyWithoutEvents], isLitigation: true });

    expect(eventRows).toHaveLength(1);
    expect(eventRows[0].id).toBe("Document 1:Event 1");
  });

  it("returns a list of event rows if there are events in the family and events on documents", () => {
    const familyWithoutEvents: TFamilyPublic = {
      collections: [],
      concepts: [],
      attribution: {} as TFamilyAttribution,
      documents: [
        {
          import_id: "Document 1",
          slug: "document-1",
          title: "Document 1",
          events: [
            {
              import_id: "Event 1",
              title: "Event 1",
              date: "2021-01-01",
              event_type: "Event",
              status: "Status",
              metadata: {
                action_taken: ["Action 1"],
                datetime_event_name: ["Datetime 1"],
                description: ["Description 1"],
                event_type: ["Event 1"],
              },
            },
          ],
        } as TFamilyDocumentPublic,
      ],
      events: [
        {
          import_id: "Event 2",
          title: "Event 2",
          date: "2021-02-01",
          event_type: "Event",
          status: "Status",
          metadata: {
            action_taken: ["Action 2"],
            datetime_event_name: ["Datetime 2"],
            description: ["Description 2"],
            event_type: ["Event 2"],
          },
        },
      ],
      metadata: {
        id: ["Id 1"],
        case_number: ["Case 1"],
      },
      geographies: [],
      import_id: "",
      last_updated_date: "",
      summary: "",
      title: "Case 1",
      published_date: "",
      slug: "",
    };

    const eventRows = getEventTableRows({ families: [familyWithoutEvents], isLitigation: true });

    expect(eventRows).toHaveLength(2);
    expect(eventRows[0].id).toBe(":Event 2");
    expect(eventRows[1].id).toBe("Document 1:Event 1");
  });

  it("returns a deduplicated list of family and document event rows if same event linked to both family and document", () => {
    const familyWithoutEvents: TFamilyPublic = {
      collections: [],
      concepts: [],
      attribution: {} as TFamilyAttribution,
      documents: [
        {
          import_id: "Document 1",
          slug: "document-1",
          title: "Document 1",
          events: [
            {
              import_id: "Event 1",
              title: "Event 1",
              date: "2021-01-01",
              event_type: "Event",
              status: "Status",
              metadata: {
                action_taken: ["Action 1"],
                datetime_event_name: ["Datetime 1"],
                description: ["Description 1"],
                event_type: ["Event 1"],
              },
            },
          ],
        } as TFamilyDocumentPublic,
      ],
      events: [
        {
          import_id: "Event 1",
          title: "Event 1",
          date: "2021-01-01",
          event_type: "Event",
          status: "Status",
          metadata: {
            action_taken: ["Action 1"],
            datetime_event_name: ["Datetime 1"],
            description: ["Description 1"],
            event_type: ["Event 1"],
          },
        },
      ],
      metadata: {
        id: ["Id 1"],
        case_number: ["Case 1"],
      },
      geographies: [],
      import_id: "",
      last_updated_date: "",
      summary: "",
      title: "Case 1",
      published_date: "",
      slug: "",
    };

    const eventRows = getEventTableRows({ families: [familyWithoutEvents], isLitigation: true });

    expect(eventRows).toHaveLength(1);
    expect(eventRows[0].id).toBe("Document 1:Event 1");
  });
});

describe("getDocumentLink", () => {
  it("does not link to /documents/null when the document has no slug", () => {
    const documentWithoutSlug = {
      import_id: "Document 1",
      slug: null,
      title: "Document 1",
      cdn_object: "https://example.com/doc.pdf",
    } as TFamilyDocumentPublic;

    render(<>{getDocumentLink(documentWithoutSlug, false, false, false)}</>);

    expect(screen.queryByRole("link", { name: /document 1/i })).not.toBeInTheDocument();
    expect(screen.getByText(/we do not have this document/i)).toBeInTheDocument();
  });

  it("links to the document preview when a slug is present", () => {
    const documentWithSlug = {
      import_id: "Document 1",
      slug: "document-1",
      title: "Document 1",
      cdn_object: "https://example.com/doc.pdf",
    } as TFamilyDocumentPublic;

    render(<>{getDocumentLink(documentWithSlug, false, false, false)}</>);

    expect(screen.getByRole("link")).toHaveAttribute("href", expect.stringContaining("/documents/document-1"));
  });
});
