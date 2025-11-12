import { LinkWithQuery } from "@/components/LinkWithQuery";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { IMetadata, TCategory, TCorpusPublic, TFamilyDocumentPublic } from "@/types";

import { getEventTableRows } from "./eventTable";

const language = "en-GB";

describe("getEventTableRows", () => {
  it("returns a list of family event rows", () => {
    const familyWithoutDocuments = {
      category: "Litigation" as TCategory,
      collections: [],
      concepts: [],
      corpus: {} as TCorpusPublic,
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
      organisation_attribution_url: null,
      metadata: {
        id: ["Id 1"],
        case_number: ["Case 1"],
      },
      geographies: [],
      import_id: "",
      last_updated_date: "",
      corpus_id: "",
      status: "",
      summary: "",
      title: "Case 1",
      organisation: "",
      published_date: "",
      slug: "",
    };

    const eventRows = getEventTableRows({ families: [familyWithoutDocuments] });

    expect(eventRows).toEqual([
      {
        id: "/0",
        cells: {
          action: "Action 1",
          caseNumber: "Case 1",
          caseTitle: "Case 1",
          court: null,
          date: {
            label: "01/01/2021",
            value: 1609459200000,
          },
          document: null,
          summary: {
            label: <ViewMore maxLines={4}>Description 1</ViewMore>,
            value: "Description 1",
          },
          title: null,
          topics: {
            label: null,
            value: "",
          },
          type: "Event",
        },
      },
    ]);
  });

  it("returns a list of document event rows", () => {
    const familyWithoutEvents = {
      category: "Litigation" as TCategory,
      collections: [],
      concepts: [],
      corpus: {} as TCorpusPublic,
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
      organisation_attribution_url: null,
      metadata: {
        id: ["Id 1"],
        case_number: ["Case 1"],
      },
      geographies: [],
      import_id: "",
      last_updated_date: "",
      corpus_id: "",
      status: "",
      summary: "",
      title: "Case 1",
      organisation: "",
      published_date: "",
      slug: "",
    };

    const eventRows = getEventTableRows({ families: [familyWithoutEvents] });

    expect(eventRows).toHaveLength(1);
    expect(eventRows[0].id).toBe("/0");

    const { document, ...cells } = eventRows[0].cells;

    expect(cells).toEqual({
      action: "Action 1",
      caseNumber: "Case 1",
      caseTitle: "Case 1",
      court: null,
      date: {
        label: "01/01/2021",
        value: 1609459200000,
      },
      summary: {
        label: <ViewMore maxLines={4}>Description 1</ViewMore>,
        value: "Description 1",
      },
      title: {
        label: <span className="">Document 1</span>,
        value: false,
      },
      topics: {
        label: null,
        value: "",
      },
      type: "Event",
    });

    expect(typeof document).toBe("object");
    expect((document as IMetadata).value).toBe("document-1:0");
  });

  it("returns a list of family and document event rows", () => {
    const familyWithoutEvents = {
      category: "Litigation" as TCategory,
      collections: [],
      concepts: [],
      corpus: {} as TCorpusPublic,
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
          date: "2021-01-01",
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
      organisation_attribution_url: null,
      metadata: {
        id: ["Id 1"],
        case_number: ["Case 1"],
      },
      geographies: [],
      import_id: "",
      last_updated_date: "",
      corpus_id: "",
      status: "",
      summary: "",
      title: "Case 1",
      organisation: "",
      published_date: "",
      slug: "",
    };

    const eventRows = getEventTableRows({ families: [familyWithoutEvents] });

    expect(eventRows).toHaveLength(1);

    const firstEventRow = eventRows[0];
    delete firstEventRow.cells.document;

    expect(eventRows[0]).toEqual({
      cells: {
        action: null,
        caseNumber: "Case 1",
        caseTitle: "Case 1",
        court: null,
        date: null,
        summary: null,
        title: {
          label: <span className="">Document 1</span>,
          value: false,
        },
        topics: {
          label: null,
          value: "",
        },
        type: null,
      },
      id: "/0",
    });
  });

  it("returns a deduplicated list of family and document event rows if same event linked to both family and document", () => {
    const familyWithoutEvents = {
      category: "Litigation" as TCategory,
      collections: [],
      concepts: [],
      corpus: {} as TCorpusPublic,
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
      organisation_attribution_url: null,
      metadata: {
        id: ["Id 1"],
        case_number: ["Case 1"],
      },
      geographies: [],
      import_id: "",
      last_updated_date: "",
      corpus_id: "",
      status: "",
      summary: "",
      title: "Case 1",
      organisation: "",
      published_date: "",
      slug: "",
    };

    const eventRows = getEventTableRows({ families: [familyWithoutEvents] });

    expect(eventRows).toHaveLength(1);
    expect(eventRows[0].id).toBe("/0");

    const { document, ...cells } = eventRows[0].cells;

    expect(cells).toEqual({
      action: "Action 1",
      caseNumber: "Case 1",
      caseTitle: "Case 1",
      court: null,
      date: {
        label: "01/01/2021",
        value: 1609459200000,
      },
      summary: {
        label: <ViewMore maxLines={4}>Description 1</ViewMore>,
        value: "Description 1",
      },
      title: {
        label: <span className="">Document 1</span>,
        value: false,
      },
      topics: {
        label: null,
        value: "",
      },
      type: "Event",
    });

    expect(typeof document).toBe("object");
    expect((document as IMetadata).value).toBe("document-1:0");
  });
});
