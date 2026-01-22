import { http, HttpResponse } from "msw";

import { TTopic } from "@/types";

export const conceptHandlers = [
  http.get("*/concepts/:id.json", ({ params }) => {
    const { id } = params;

    const concepts: TTopic[] = [
      {
        alternative_labels: [],
        description: "test concept 1",
        has_subconcept: [],
        negative_labels: [],
        preferred_label: "child topic 1",
        recursive_subconcept_of: ["Q1651"],
        related_concepts: [],
        subconcept_of: [],
        wikibase_id: "1",
      },
      {
        alternative_labels: [],
        description: "test concept 2",
        has_subconcept: [],
        negative_labels: [],
        preferred_label: "child topic 2",
        recursive_subconcept_of: ["Q1651"],
        related_concepts: [],
        subconcept_of: [],
        wikibase_id: "2",
      },
      {
        alternative_labels: [],
        description: "test root concept",
        has_subconcept: [],
        negative_labels: [],
        preferred_label: "parent topic",
        recursive_subconcept_of: [],
        related_concepts: [],
        subconcept_of: [],
        wikibase_id: "Q1651",
      },
    ];

    return HttpResponse.json(concepts.find((c) => c.wikibase_id === (id as string).split(".")[0]));
  }),
];
