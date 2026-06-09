export type TSearchLabel = {
  id: string;
  type: "country" | "region" | "subdivision" | "city";
  value: string;
  labels: TRelatedSearchLabel[];
};

export type TNestedSearchLabel = TSearchLabel & {
  children: TNestedSearchLabel[];
};

export type TRelatedSearchLabel = {
  type: "subconcept_of";
  value: TSearchLabel;
  timestamp: null;
  passages_id: null;
  count: null;
};

/**
 * Use cases to test:
 * 1. A label nested under two labels
 * 2. Label ordering does not follow the nesting hierarchy
 * 3. A label nested under two labels not on the same hierarchical level
 */

export const FILTER_DATA_STUB: TSearchLabel[] = [
  {
    id: "region::South Asia",
    type: "region",
    value: "South Asia",
    labels: [],
  },
  {
    id: "country::China",
    type: "country",
    value: "China",
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
    id: "subdivision::Shared",
    type: "subdivision",
    value: "Shared",
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
      {
        type: "subconcept_of",
        value: {
          id: "country::China",
          type: "country",
          value: "China",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
  },
  {
    id: "city::Test City",
    type: "city",
    value: "Test City",
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
      {
        type: "subconcept_of",
        value: {
          id: "subdivision::Shared",
          type: "subdivision",
          value: "Shared",
          labels: [],
        },
        timestamp: null,
        passages_id: null,
        count: null,
      },
    ],
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
