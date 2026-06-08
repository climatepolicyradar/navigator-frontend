export type TSearchLabel = {
  id: string;
  type: "country" | "region" | "subdivision";
  value: string;
  labels: TRelatedSearchLabel[];
};

export type TRelatedSearchLabel = {
  type: "subconcept_of";
  value: TSearchLabel;
  timestamp: null;
  passages_id: null;
  count: null;
};

export const FILTER_DATA_STUB: TSearchLabel[] = [
  {
    id: "region::South Asia",
    type: "region",
    value: "South Asia",
    labels: [],
  },
  {
    id: "country::India",
    type: "country",
    value: "India",
    labels: [
      {
        type: "subconcept_of",
        value: {
          id: "region::South Asia",
          type: "region",
          value: "South Asia",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
  {
    id: "subdivision::Kerela",
    type: "subdivision",
    value: "Kerela",
    labels: [
      {
        type: "subconcept_of",
        value: {
          id: "country::India",
          type: "country",
          value: "India",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
  {
    id: "subdivision::Punjab",
    type: "subdivision",
    value: "Punjab",
    labels: [
      {
        type: "subconcept_of",
        value: {
          id: "country::India",
          type: "country",
          value: "India",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
  {
    id: "region::North America",
    type: "region",
    value: "North America",
    labels: [],
  },
  {
    id: "country::USA",
    type: "country",
    value: "USA",
    labels: [
      {
        type: "subconcept_of",
        value: {
          id: "region::North America",
          type: "region",
          value: "North America",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
  {
    id: "country::Canada",
    type: "country",
    value: "Canada",
    labels: [
      {
        type: "subconcept_of",
        value: {
          id: "region::North America",
          type: "region",
          value: "North America",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
  {
    id: "subdivision::Texas",
    type: "subdivision",
    value: "Texas",
    labels: [
      {
        type: "subconcept_of",
        value: {
          id: "country::USA",
          type: "country",
          value: "USA",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
  {
    id: "subdivision::California",
    type: "subdivision",
    value: "California",
    labels: [
      {
        type: "subconcept_of",
        value: {
          id: "country::USA",
          type: "country",
          value: "USA",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
  {
    id: "subdivision::British Columbia",
    type: "subdivision",
    value: "British Columbia",
    labels: [
      {
        type: "subconcept_of",
        value: {
          id: "country::Canada",
          type: "country",
          value: "Canada",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
];
