import { http, HttpResponse } from "msw";

import { TNestedSearchLabel } from "@/types";

export const taxonomyHandler = (overrides: Partial<{ body: TNestedSearchLabel[] }> = {}) =>
  http.get("*/search/labels:taxonomy", () => HttpResponse.json({ data: overrides.body ?? [] }));
