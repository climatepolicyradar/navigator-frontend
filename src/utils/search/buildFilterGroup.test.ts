import { TFilterPathLabel, TSearchQueryGroup, TSearchQueryRule } from "@/types";

import { buildFilterGroup } from "./buildFilterGroup";

/**
 * RULES:
 * 1. all TFilterPathLabel are represented in the output by a TSearchQueryRule
 * 2. TFilterPathLabel that are children of another TFilterPathLabel are surrounded by an AND
 * 3. sibling TFilterPathLabel with the same type are surrounded by an OR
 * 4. sibling TFilterPathLabel with different types are surrounded by an AND
 * 5. there are no redundant AND or OR TSearchQueryGroup - each must contain 2 or more filters
 */

describe("buildFilterGroup", () => {
  it("builds a filter for one first level filter", () => {
    const allPathLabels: TFilterPathLabel[][] = [
      [
        {
          id: "category::Multilateral Climate Fund project",
          type: "category",
          value: "Multilateral Climate Fund project",
        },
      ],
    ];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
      field: "labels.value.id",
      op: "contains",
      value: "category::Multilateral Climate Fund project",
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for multiple first level filters", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
      op: "or",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::Multilateral Climate Fund project",
        },
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for one second level filter", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for one second level filter and its parent", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
        {
          field: "labels.value.id",
          op: "contains",
          value: "category::UN submission",
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for multiple second level filters, siblings + same type", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];

    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
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
            },
            {
              field: "labels.value.id",
              op: "contains",
              value: "author_type::Individual",
            },
          ],
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for multiple second level filters, siblings + different types (1+1)", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];

    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
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
            },
            {
              field: "labels.value.id",
              op: "contains",
              value: "report_type::Climate council report",
            },
          ],
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for multiple second level filters, siblings + different types (2+1)", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];

    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
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
                },
                {
                  field: "labels.value.id",
                  op: "contains",
                  value: "author_type::Industry body",
                },
              ],
            },
            {
              field: "labels.value.id",
              op: "contains",
              value: "report_type::Climate council report",
            },
          ],
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for one third level filter", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
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
              field: "labels.value.id",
              op: "contains",
              value: "document_type::Country Report (CR)",
            },
          ],
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for two third level filters with different parents", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
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
                  field: "labels.value.id",
                  op: "contains",
                  value: "document_type::Country Report (CR)",
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
                  field: "labels.value.id",
                  op: "contains",
                  value: "entity_type::Adaptation Communication (AC)",
                },
              ],
            },
          ],
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for second and third level filters with the same sibling types", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
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
                  field: "labels.value.id",
                  op: "contains",
                  value: "jurisdiction::Australian Capital Territory",
                },
              ],
            },
          ],
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for second and third level filters with different sibling types", () => {
    const allPathLabels: TFilterPathLabel[][] = [
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
    ];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
      op: "and",
      filters: [],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });

  it("builds a filter for a complex example", () => {
    const allPathLabels: TFilterPathLabel[][] = [];
    const expectedFilterGroup: TSearchQueryGroup | TSearchQueryRule = {
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
                  field: "labels.value.id",
                  op: "contains",
                  value: "jurisdiction::Massachusetts District Court (Mass. Dist. Ct.)",
                },
              ],
            },
          ],
        },
      ],
    };

    expect(buildFilterGroup(allPathLabels)).toEqual(expectedFilterGroup);
  });
});
