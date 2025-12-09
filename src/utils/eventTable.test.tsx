import { TCategory, TCorpusPublic, TFamilyDocumentPublic } from "@/types";

import { getEventTableRows } from "./eventTable";

describe("getEventTableRows", () => {
  it("returns an empty list of document rows if there are no documents in the family", () => {
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

    const eventRows = getEventTableRows({ families: [familyWithoutDocuments], isLitigation: false });

    expect(eventRows).toEqual([]);
  });

  it("returns a list of document event rows if there are documents in the family", () => {
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

    const eventRows = getEventTableRows({ families: [familyWithoutEvents], isLitigation: true });

    expect(eventRows).toHaveLength(1);
    expect(eventRows[0].id).toBe("Document 1:Event 1");
  });

  it("returns a list of event rows if there are events in the family and events on documents", () => {
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

    const eventRows = getEventTableRows({ families: [familyWithoutEvents], isLitigation: true });

    expect(eventRows).toHaveLength(2);
    expect(eventRows[0].id).toBe(":Event 2");
    expect(eventRows[1].id).toBe("Document 1:Event 1");
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

    const eventRows = getEventTableRows({ families: [familyWithoutEvents], isLitigation: true });

    expect(eventRows).toHaveLength(1);
    expect(eventRows[0].id).toBe("Document 1:Event 1");
  });
});
