import { TTheme } from "@/types";

/**
 * `llms.txt` bodies, per theme.
 *
 * https://llmstxt.org — a plain-text index an agent reads *instead of* crawling
 * the site, so it can find the right door without fetching every page. The unit
 * is `- [Name](url): what it is`; the one-line description is the part that does
 * the work, because without it an agent has to follow every link to find out
 * which one it wanted.
 *
 * This is the hub of a hub-and-spoke pair: it routes to the surfaces CPR
 * publishes, and the deep detail (data model, filter grammar, sorting,
 * freshness) stays in the API's own spoke at
 * https://api.climatepolicyradar.org/search/llms.txt. Keep the routing here and
 * the depth there — restating the API's grammar in both places gives you two
 * spokes and no hub.
 *
 * Keyed by theme because each one is a distinct product on its own domain
 * (app.climatepolicyradar.org, climate-laws.org, climateprojectexplorer.org,
 * www.climatecasechart.com). A theme with no entry here serves a 404 rather
 * than another theme's content — see `src/pages/llms.txt.ts`.
 */
export const LLMS_TXT_BY_THEME: Partial<Record<TTheme, string>> = {
  cpr: `# Climate Policy Radar

> An open database of the world's climate law, policy, litigation, climate
> finance and UN Convention submissions, with full text, expert concept
> labelling and provenance. Maintained by Climate Policy Radar CIC, a
> non-profit. Licensed CC-BY 4.0 — attribution required.

Coverage is global and multilingual. Documents are stored in their original
language with English translations of matching passages available. Start with
the search API for targeted queries; use the bulk dataset for anything
resembling a full crawl.

## Querying the data

- [Search API instructions](https://api.climatepolicyradar.org/search/llms.txt): How to query the API — data model, filter grammar, sorting, freshness. Read this before calling any endpoint.
- [OpenAPI schema](https://api.climatepolicyradar.org/search/openapi.json): Machine-readable contract — exact response shapes, enum values, parameter types.
- [MCP server](https://api.climatepolicyradar.org/search/mcp): The same endpoints as tools over Streamable HTTP, for clients that speak MCP.

## Working with the data

- [Human-facing search](https://app.climatepolicyradar.org/search): The web UI, for linking people to results.

## Optional

- [About Climate Policy Radar](https://climatepolicyradar.org): Who maintains this and why.
- Commercial use and terms: contact partners@climatepolicyradar.org
`,
};
