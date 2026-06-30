import { TFilterPathLabel, TSearchQueryGroup } from "@/types";

import { DEFAULT_SEARCH_QUERY_GROUP, filterPathsToQueryGroup } from "./filterPathsToQueryGroup";

/**
 * RULES:
 * 1. all TFilterPathLabel are represented in the output by a TSearchQueryRule
 * 2. TFilterPathLabel that are children of another TFilterPathLabel are surrounded by an AND
 * 3. sibling TFilterPathLabel with the same type are surrounded by an OR
 * 4. sibling TFilterPathLabel with different types are surrounded by an AND
 * 5. nested TFilterPathLabel are separated from each other by at least one TSearchQueryGroup
 */

type TFilterTestCase = {
  name: string;
  filterPathLabels: TFilterPathLabel[][];
  searchQueryGroup: TSearchQueryGroup;
};

export const FILTER_TEST_CASES: TFilterTestCase[] = [
  {
    name: "no filters",
    filterPathLabels: [],
    searchQueryGroup: DEFAULT_SEARCH_QUERY_GROUP,
  },
  {
    name: "one first level filter",
    filterPathLabels: [
      [
        {
          id: "category::Multilateral Climate Fund project",
          type: "category",
          value: "Multilateral Climate Fund project",
        },
      ],
    ],
    searchQueryGroup: {
      op: "or",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::Multilateral Climate Fund project",
          checked: true,
        },
      ],
    },
  },
  {
    name: "multiple first level filters",
    filterPathLabels: [
      [
        {
          id: "category::Multilateral Climate Fund project",
          type: "category",
          value: "Multilateral Climate Fund project",
        },
      ],
      [
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
    ],
    searchQueryGroup: {
      op: "or",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::Multilateral Climate Fund project",
          checked: true,
        },
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
          checked: true,
        },
      ],
    },
  },
  {
    name: "one second level filter",
    filterPathLabels: [
      [
        {
          id: "un_convention::UNCCD",
          type: "un_convention",
          value: "UNCCD",
        },
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
        {
          op: "or",
          filters: [
            {
              field: "labels.value.id",
              op: "contains",
              value: "un_convention::UNCCD",
              checked: true,
            },
          ],
        },
      ],
    },
  },
  {
    name: "one second level filter and its parent",
    filterPathLabels: [
      [
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
      [
        {
          id: "un_convention::UNCCD",
          type: "un_convention",
          value: "UNCCD",
        },
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
          checked: true,
        },
        {
          op: "or",
          filters: [
            {
              field: "labels.value.id",
              op: "contains",
              value: "un_convention::UNCCD",
              checked: true,
            },
          ],
        },
      ],
    },
  },
  {
    name: "multiple second level filters, siblings + same type",
    filterPathLabels: [
      [
        {
          id: "author_type::Corporate",
          type: "author_type",
          value: "Corporate",
        },
        {
          id: "category::Report",
          type: "category",
          value: "Report",
        },
      ],
      [
        {
          id: "author_type::Individual",
          type: "author_type",
          value: "Individual",
        },
        {
          id: "category::Report",
          type: "category",
          value: "Report",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::Report",
        },
        {
          op: "or",
          filters: [
            {
              field: "labels.value.id",
              op: "contains",
              value: "author_type::Corporate",
              checked: true,
            },
            {
              field: "labels.value.id",
              op: "contains",
              value: "author_type::Individual",
              checked: true,
            },
          ],
        },
      ],
    },
  },
  {
    name: "multiple second level filters, siblings + different types (1+1)",
    filterPathLabels: [
      [
        {
          id: "author_type::Corporate",
          type: "author_type",
          value: "Corporate",
        },
        {
          id: "category::Report",
          type: "category",
          value: "Report",
        },
      ],
      [
        {
          id: "report_type::Climate council report",
          type: "report_type",
          value: "Climate council report",
        },
        {
          id: "category::Report",
          type: "category",
          value: "Report",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::Report",
        },
        {
          op: "and",
          filters: [
            {
              field: "labels.value.id",
              op: "contains",
              value: "author_type::Corporate",
              checked: true,
            },
            {
              field: "labels.value.id",
              op: "contains",
              value: "report_type::Climate council report",
              checked: true,
            },
          ],
        },
      ],
    },
  },
  {
    name: "multiple second level filters, siblings + different types (2+1)",
    filterPathLabels: [
      [
        {
          id: "author_type::Corporate",
          type: "author_type",
          value: "Corporate",
        },
        {
          id: "category::Report",
          type: "category",
          value: "Report",
        },
      ],
      [
        {
          id: "author_type::Industry body",
          type: "author_type",
          value: "Industry body",
        },
        {
          id: "category::Report",
          type: "category",
          value: "Report",
        },
      ],
      [
        {
          id: "report_type::Climate council report",
          type: "report_type",
          value: "Climate council report",
        },
        {
          id: "category::Report",
          type: "category",
          value: "Report",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::Report",
        },
        {
          op: "and",
          filters: [
            {
              op: "or",
              filters: [
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "author_type::Corporate",
                  checked: true,
                },
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "author_type::Industry body",
                  checked: true,
                },
              ],
            },
            {
              field: "labels.value.id",
              op: "contains",
              value: "report_type::Climate council report",
              checked: true,
            },
          ],
        },
      ],
    },
  },
  {
    name: "one third level filter",
    filterPathLabels: [
      [
        {
          id: "document_type::Country Report (CR)",
          type: "document_type",
          value: "Country Report (CR)",
        },
        {
          id: "un_convention::UNCCD",
          type: "un_convention",
          value: "UNCCD",
        },
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
        {
          op: "and",
          filters: [
            {
              field: "labels.value.id",
              op: "contains",
              value: "un_convention::UNCCD",
            },
            {
              op: "or",
              filters: [
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "document_type::Country Report (CR)",
                  checked: true,
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "one third level filter and its parent",
    filterPathLabels: [
      [
        {
          id: "un_convention::UNCCD",
          type: "un_convention",
          value: "UNCCD",
        },
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
      [
        {
          id: "document_type::Country Report (CR)",
          type: "document_type",
          value: "Country Report (CR)",
        },
        {
          id: "un_convention::UNCCD",
          type: "un_convention",
          value: "UNCCD",
        },
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
        {
          op: "and",
          filters: [
            {
              field: "labels.value.id",
              op: "contains",
              value: "un_convention::UNCCD",
              checked: true,
            },
            {
              op: "or",
              filters: [
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "document_type::Country Report (CR)",
                  checked: true,
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "two third level filters with different parents",
    filterPathLabels: [
      [
        {
          id: "document_type::Country Report (CR)",
          type: "document_type",
          value: "Country Report (CR)",
        },
        {
          id: "un_convention::UNCCD",
          type: "un_convention",
          value: "UNCCD",
        },
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
      [
        {
          id: "entity_type::Adaptation Communication (AC)",
          type: "entity_type",
          value: "Adaptation Communication (AC)",
        },
        {
          id: "un_convention::UNFCCC",
          type: "un_convention",
          value: "UNFCCC",
        },
        {
          id: "category::UN submission",
          type: "category",
          value: "UN submission",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
        {
          op: "or",
          filters: [
            {
              op: "and",
              filters: [
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "un_convention::UNCCD",
                },
                {
                  op: "or",
                  filters: [
                    {
                      field: "labels.value.id",
                      op: "contains",
                      value: "document_type::Country Report (CR)",
                      checked: true,
                    },
                  ],
                },
              ],
            },
            {
              op: "and",
              filters: [
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "un_convention::UNFCCC",
                },
                {
                  op: "or",
                  filters: [
                    {
                      field: "labels.value.id",
                      op: "contains",
                      value: "entity_type::Adaptation Communication (AC)",
                      checked: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "second and third level filters with the same sibling types",
    filterPathLabels: [
      [
        {
          id: "jurisdiction::Argentina",
          type: "jurisdiction",
          value: "Argentina",
        },
        {
          id: "category::Litigation",
          type: "category",
          value: "Litigation",
        },
      ],
      [
        {
          id: "jurisdiction::Australian Capital Territory",
          type: "jurisdiction",
          value: "Australian Capital Territory",
        },
        {
          id: "jurisdiction::Australia",
          type: "jurisdiction",
          value: "Australia",
        },
        {
          id: "category::Litigation",
          type: "category",
          value: "Litigation",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::Litigation",
        },
        {
          op: "or",
          filters: [
            {
              field: "labels.value.id",
              op: "contains",
              value: "jurisdiction::Argentina",
              checked: true,
            },
            {
              op: "and",
              filters: [
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "jurisdiction::Australia",
                },
                {
                  op: "or",
                  filters: [
                    {
                      field: "labels.value.id",
                      op: "contains",
                      value: "jurisdiction::Australian Capital Territory",
                      checked: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "second and third level filters with different sibling types",
    filterPathLabels: [
      [
        {
          id: "case_category::Adaptation (US)",
          type: "case_category",
          value: "Adaptation (US)",
        },
        {
          id: "category::Litigation",
          type: "category",
          value: "Litigation",
        },
      ],
      [
        {
          id: "jurisdiction::Massachusetts District Court (Mass. Dist. Ct.)",
          type: "jurisdiction",
          value: "Massachusetts District Court (Mass. Dist. Ct.)",
        },
        {
          id: "jurisdiction::United States",
          type: "jurisdiction",
          value: "United States",
        },
        {
          id: "category::Litigation",
          type: "category",
          value: "Litigation",
        },
      ],
    ],
    searchQueryGroup: {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::Litigation",
        },
        {
          op: "and",
          filters: [
            {
              field: "labels.value.id",
              op: "contains",
              value: "case_category::Adaptation (US)",
              checked: true,
            },
            {
              op: "and",
              filters: [
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "jurisdiction::United States",
                },
                {
                  op: "or",
                  filters: [
                    {
                      field: "labels.value.id",
                      op: "contains",
                      value: "jurisdiction::Massachusetts District Court (Mass. Dist. Ct.)",
                      checked: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

describe("filterPathsToQueryGroup", () => {
  it.each(FILTER_TEST_CASES.map(({ name, filterPathLabels, searchQueryGroup }) => [name, filterPathLabels, searchQueryGroup]))(
    "builds a filter for %s",
    (_name, filterPathLabels, expectedFilterGroup) => {
      expect(filterPathsToQueryGroup(filterPathLabels)).toEqual(expectedFilterGroup);
    }
  );
});
