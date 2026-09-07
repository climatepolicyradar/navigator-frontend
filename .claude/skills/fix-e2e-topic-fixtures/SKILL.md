---
name: fix-e2e-topic-fixtures
description: Check and repair navigator-frontend E2E test fixtures (tests/generic/testFamilies.ts, tests/generic/testDocuments.ts) when their expected topic/concept has disappeared from search results, causing E2E failures like "Topics mentioned most" region or a topic checkbox not found. Use when an E2E job fails with a topic/concept-related timeout, or proactively to check fixture health.
---

# Fix E2E Topic Fixtures

## Why this exists

Topics/concepts occasionally and intermittently disappear from specific documents or
families in search results — a known, semi-regular data issue (not caused by anything
in this repo; the root cause lives in the indexing/search pipeline). When this happens
to a document/family used by an E2E fixture, the test can no longer find the topic it
expects, and the E2E job fails on every open PR until someone finds a replacement
doc/family and updates the fixture by hand.

This skill does that check-and-repair, live, each time it's run — there is no
pre-built script. Follow the steps below directly.

## Background you need before touching anything

**Fixture files, their shape, and what each field means:**

- `tests/generic/testFamilies.ts` — exports `TEST_FAMILIES: TTestFamily[]`. Each entry:
  ```ts
  {
    titleForTests: string;      // human label, used in test names — describes the replacement doc/family's actual nature (e.g. "Offshore Wind Report", "Litigation"); if the best verified replacement for a broken entry is a different kind of document, update this label to match rather than leaving a now-inaccurate title, but keep it short and in the same style as its neighbours
    slug: string;               // the family slug, e.g. "clean-electricity-regulations-sor-2024-263_3e84"
    withSearch: string;         // URL-param-encoded search term with passage matches on the family (+ instead of spaces)
    withTopic: string;          // URL-param-encoded topic/concept name that exists on the family (+ instead of spaces)
    availableOn: TTheme[];      // which themes ("cpr" | "cclw" | "mcf" | "ccc") this fixture is used on
  }
  ```
- `tests/generic/testDocuments.ts` — exports `TEST_DOCUMENTS: TTestDocument[]`. Same
  shape as above, plus:
  ```ts
  withParentTopic: string;      // the parent topic of withTopic (topics are hierarchical) — NOT url-encoded, e.g. "Fossil fuel"
  ```
  Note `withTopic`/`withSearch` in `testDocuments.ts` are plain strings (spaces, not
  `+`), while in `testFamilies.ts` they're URL-encoded (`+` for spaces) — match
  whichever convention the file you're editing already uses.

**How a fixture is actually exercised (so you know what "broken" looks like):**

- Family fixtures: `tests/generic/genericFamilyTests.ts` loads
  `/document/{slug}?q={withSearch}&cfn={withTopic}`, then asserts a region headed
  "Topics mentioned most..." becomes visible
  (`tests/pageObjectModels/familyPageModel.ts:14`,
  `page.getByRole("region").filter({ has: page.getByRole("heading", { name: /^Topics mentioned most/ }) })`).
  If the family has no search+topic matches at all, this region never renders and the
  test times out with "element(s) not found".
- Document fixtures: `tests/generic/genericDocumentTests.ts` loads
  `/documents/{slug}`, opens the `withParentTopic` accordion, and asserts a checkbox
  named `withTopic` becomes checked and a "Passage matches" list becomes non-empty.

**The API mechanism — READ THIS CAREFULLY, it's the part that's easy to get wrong:**

A fixture's `slug` is a human-readable URL slug (e.g.
`clean-electricity-regulations-sor-2024-263_3e84`). Neither the search API nor the
families/document endpoints below accept slugs — they require a dotted "import ID"
(e.g. `CCLW.family.i00003201.n0000`). The frontend resolves slug → import ID via a
separate endpoint before ever calling either. You must do the same two-step
resolution — **never pass a slug directly as `family_ids`/`document_ids` on
`/searches`, or as the `{id}` path segment on `/families/{id}` or `/document/{id}`**.

⚠️ **Do not skip the resolve step.** Passing a slug directly into any of these
`{id}`-shaped fields does not merely fail cleanly — it hits a known production bug
(a catastrophically-backtracking regex validating that field, tracked as FUS-406)
that can hang for a very long time and, in production, has caused a real container
to freeze and get killed by ECS. Never send a slug into an id field, including for
quick manual checks.

⚠️ **`/searches` is the wrong endpoint to check fixture health against — do not use
it for that.** It was the first thing that looks plausible here, and using it
produces convincing-looking but *wrong* results: it can report a family/document as
healthy (passage matches present, with the right concept name attached to a matched
passage) even when the actual field the frontend renders from is empty. Verified by
direct comparison: a family with `concept_counts: null` on `/families/{id}` — which
means the "Topics mentioned most" region renders empty and the test fails — still
returns hits with matching concepts from `/searches`. These are two different views
over the same document and they can disagree. Only the endpoints in step 3 below
reflect what the E2E tests actually depend on.

1. **Resolve slug → import ID** (public endpoint, no auth needed):
   ```bash
   curl -s "https://api.climatepolicyradar.org/families/slugs/{slug}"
   ```
   Returns `{"data": {"family_import_id": "...", "family_document_import_id": "..." | null, ...}}`.
   - For a **family** fixture, use `family_import_id`.
   - For a **document** fixture, use `family_document_import_id` if present; if it's
     `null` for that slug, the slug you have is actually a family-root document and
     you should treat `family_import_id` as the relevant id for filtering purposes,
     but re-check the fixture's intent (it should be a specific document, not a
     family root) — flag this rather than guessing if it looks wrong.

2. **Get a production app token — one per theme, not one for everything.** Each
   theme's deployment hands out a token scoped to only the corpora that theme is
   allowed to see (`allowed_corpora_ids` in the JWT payload). A CPR-scoped token
   cannot query the CCC/litigation corpus (and vice versa) — it doesn't error
   loudly, it just returns zero hits, which looks exactly like a genuinely broken
   fixture. **Using the wrong theme's token is a false-positive trap** — always
   fetch the token for the specific theme you're about to check.

   Each theme's production `baseURL` is listed in `playwright.config.ts` (e.g.
   `cpr_production`, `cclw_production`, `mcf_production`, `ccc_production`). For a
   fixture with `availableOn: ["cpr", "cclw"]`, you can use either theme's token,
   since one entry's health only needs to be confirmed from one working angle — but
   if a check comes back with zero hits, retry with a token from a *different* theme
   in that fixture's `availableOn` before concluding it's actually broken.

   ```bash
   curl -s "https://{theme_production_baseURL}/api/env"
   ```
   Returns `{"env": {"api_url": "...", "app_token": "...", "theme": "..."}}`. Use
   `api_url` (the search API base — same host across all themes) and `app_token`
   (the `app-token` header value, theme-scoped) from this response — don't hardcode
   them, they can rotate. This is a public endpoint, safe to call — it's the exact
   token each production site already hands to any browser client-side, not a
   privileged secret.

3. **Query the endpoint the frontend actually uses**, with the resolved import ID,
   never the slug:
   - **Family fixture:**
     ```bash
     curl -s "{api_url}/families/{import_id}?max_hits_per_family=100" \
       -H "app-token: {app_token}"
     ```
     (mirrors `src/bff/methods/getFamilyData.ts`)
   - **Document fixture:**
     ```bash
     curl -s "{api_url}/document/{import_id}" \
       -H "app-token: {app_token}"
     ```
     (mirrors `src/bff/methods/getDocumentData.ts`)

   Both are GET requests to `{api_url}` (the same host `/searches` uses), returning
   `{"families": [{"id": ..., "hits": [{..., "concept_counts": {...} | null, ...}]}]}`.

   A fixture is **healthy** if any `hits[].concept_counts` object contains a key
   whose label (the part after the `Q1234:` id prefix, e.g. `"Q764:construction sector"`
   → `construction sector`) matches the expected topic name (case-insensitive).
   A fixture is **broken** if `concept_counts` is `null`/empty on every hit, or none
   of the keys match the expected topic.

   This is the field `processFamilyTopics.ts`/`extractTopicIds.ts` read to build the
   "Topics mentioned most" region and the document topic checkboxes — it is a
   different signal from passage-level search matches and can be empty even when
   `/searches` finds matching passages for the same document. Do not substitute a
   `/searches` check for this one.

   A zero-hit result (`total_family_hits: 0`, or `"detail": "Error validating corpora IDs."`)
   is **not** proof the fixture is broken — it's equally consistent with the token
   being scoped to the wrong theme (see step 2). Before reporting BROKEN, retry the
   same query with a token from a different theme in the fixture's `availableOn` list.
   Only report BROKEN once you've confirmed the result holds across every theme the
   fixture claims to be available on.

## How to run a check-and-repair pass

1. Read both fixture files (`tests/generic/testFamilies.ts`,
   `tests/generic/testDocuments.ts`) to get the current entries.
2. Fetch a fresh app token (step 2 above) once — reuse it for all checks in this pass.
3. For every entry in both files: resolve its slug to an import ID (step 1), then run
   the `/families/{id}` or `/document/{id}` check (step 3) to determine healthy vs
   broken. Do this for every entry, not just ones you suspect — any entry can
   silently break the same way.
4. For each **broken** entry, find a replacement:
   - Use `POST {api_url}/searches` with no `family_ids`/`document_ids` filter — just
     `query_string` and `concept_filters` for the same topic name — to *discover*
     candidate documents/families that mention that topic. This is a reasonable way
     to generate candidates (it searches a much larger set at once than checking
     families one at a time), but a `/searches` hit is only a lead, not proof — see
     the next bullet. Use a token from one of the fixture's `availableOn` themes;
     results outside that token's `allowed_corpora_ids` simply won't appear, so
     prefer the broadest-access token you have available (e.g. `cpr`'s token
     typically sees the most corpora) unless the fixture is theme-restricted to
     something narrower (like `ccc`).
   - ⚠️ **Before accepting any candidate, re-verify it the same way you checked the
     original fixture** — resolve its slug/id and query `/families/{id}` or
     `/document/{id}` directly, confirming `concept_counts` actually contains the
     topic. A `/searches` hit does not guarantee `concept_counts` is populated for
     that same document (that mismatch is the exact reason the original fixture
     broke) — skipping this re-verification risks replacing one broken fixture with
     another.
   - From the results, pick a candidate that:
     - Is available on every theme listed in the fixture's `availableOn`. Check this
       via the result's `corpus_import_id` field against each theme's corpus list in
       `themes/{theme}/config.ts` (`defaultCorpora`, or the `"All"`/`"all"` category's
       `value` array for themes that use categories instead).
     - For document fixtures: has the same `withParentTopic` relationship — check the
       matched concept's parent in the response, or re-derive by checking what topic
       hierarchy the candidate's concept belongs to.
     - Is not the same broken slug you're replacing.
   - If no such candidate exists, leave that entry alone and report it as unresolved —
     do not guess or force a partial match.
5. For resolved fixes, edit only that entry's fields in the fixture file (`slug`, and
   `withSearch`/`withTopic`/`withParentTopic` only if they genuinely had to change to
   find a working replacement — prefer keeping them if the original topic/search term
   still works on the new slug; also update `titleForTests` if the replacement is a
   meaningfully different kind of document than the original title implies). Leave
   every other entry byte-for-byte untouched.
6. Report a summary: which entries were checked, which were healthy, which were fixed
   (old slug → new slug, noting any title change), and any left unresolved needing
   manual attention.

## After running

- Review the diff (`git diff tests/generic/testFamilies.ts tests/generic/testDocuments.ts`)
  — only entries reported as fixed should show changes.
- Optionally run the affected spec locally to confirm, e.g.
  `npx playwright test tests/cpr/family.spec.ts -g "<titleForTests>"`.
- Commit and open a PR as normal — this does not bypass review, it just gets you
  unblocked with a concrete fix to submit.

## Known limitations

- Checks against production only. If the failing CI run used a different
  `PLAYWRIGHT_ENV`/theme-specific backend, this may not reflect that environment,
  though in practice all themes' `.env.example` configs point at the same production
  backend/concepts API hosts.
- This is a workaround for a data issue, not a fix for the underlying cause — topics
  can drop again on the same or a different doc/family later.
- Topics dropping is often **transient** — a fixture that looks broken in a CI run
  from a few hours ago may already be healthy again by the time you check. Always
  re-check live before concluding something needs fixing; don't assume a past CI
  failure still reflects the current state.
