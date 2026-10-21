# Feature flag lifecycle

How to **add**, **enable**, **disable** and **delete** a feature flag -- from
registering a key, through rolling the feature out to everyone, to removing the
flag once the work has shipped.

## Which operation do you want?

| I want to...                                     | Mechanism                                               | Takes effect                 | Go to                                       |
| ------------------------------------------------ | ------------------------------------------------------- | ---------------------------- | ------------------------------------------- |
| Hide new work in production while I build it     | New key in `FEATURE_FLAG_KEYS` + PostHog flag at 0%     | Next deploy                  | [Add](#add-a-feature-flag)                  |
| Switch the feature on just for me, to preview it | `/_feature-flags` widget, or the `feature_flags` cookie | Immediately, my browser only | [Enable for yourself](#enable-for-yourself) |
| Roll the feature out to everyone on one app      | `features` object in that theme's config, set to `true` | Next deploy                  | [Enable for everyone](#enable-for-everyone) |
| Switch the feature off again for everyone        | Depends on how it was turned on                         | See the section              | [Disable](#disable-a-feature)               |
| Retire the flag now the work has shipped or died | Remove the key, then tidy up in PostHog                 | Next deploy                  | [Delete](#delete-a-feature-flag)            |

The three mechanisms behind these operations -- A/B test, feature flag and theme
feature -- are compared in the Features section of [README.md](../README.md).
This document covers the feature flag and theme feature columns.

The key distinction to hold onto:

- A **feature flag** is a PostHog flag at 0% rollout. It is opt-in, per person,
  and reversible from PostHog without a deploy. Use it while building.
- A **theme feature** is a boolean in a theme's config file. It is on for
  everybody using that app, and changing it needs a PR and a deploy. Use it to
  go live.

`isFeatureEnabled` (`src/utils/features.ts`) combines them: the theme feature
wins when it is `true`, otherwise the PostHog flag decides. So a feature can be
flag-controlled on some apps and permanently live on others.

## Add a feature flag

Put new work behind a PostHog flag at 0% rollout, so it can be previewed in
production without being exposed to users.

### 1. Create the flag in PostHog

Create a feature flag whose key exactly matches the key you will add to the code
in step 2, and set its rollout to **0%**. At 0% nobody gets the flag by default,
so the work stays hidden until someone opts in.

### 2. Register the key in the app

Add the key to `FEATURE_FLAG_KEYS` in `src/types/features.ts`:

```ts
export const FEATURE_FLAG_KEYS = [
  "debug",
  "new-search",
  "themes",
  "your-flag-key",
] as const;
```

That array is the only wiring needed. `DEFAULT_FEATURE_FLAGS`
(`src/constants/features.ts`), the `/_feature-flags` page and `useFeatures` all
derive from it, and the flag defaults to `false`.

Keys are unique across all three arrays in that file, and each feature normally
belongs to one of them. A key may appear in more than one array deliberately --
see the overlap note in the README -- but only do that when you want both
mechanisms (see step 4).

### 3. Gate the feature on the key

For a landing page, set `requiredFeature` in its `TLandingPageConfig`:

```ts
const landingPageConfig: TLandingPageConfig = {
  // ...
  requiredFeature: "your-flag-key",
};
```

Elsewhere, read the flag from `FeaturesContext`, or call `getFeatures()` inside
`getServerSideProps` or a page component.

⚠️ `requiredFeature` renders the 404 page when the flag is off, but the route
still returns HTTP 200 and the page is still built into the bundle. This is
deliberate -- these pages are statically built, so `request.cookies` is not
available at build time (see `src/components/organisms/LandingPage.tsx`). It is
fine for incremental release, but it does not hide the content from anyone who
looks at the URL or the JavaScript bundle. Do not rely on it for anything
confidential.

### 4. Optionally add a per-theme go-live switch

If you want to be able to turn the feature on permanently for a given app later,
also add the key to `CONFIG_FEATURE_KEYS` in `src/types/features.ts`, and to the
`features` object of each theme config, set to `false`:

```ts
features: {
  // Only toggle to true here when you want this to go live.
  // Until then it stays false and the PostHog flag controls access.
  "your-flag-key": false,
  // ...
},
```

`themeConfig.features` is typed as `TConfigFeatures`, which is derived from
`CONFIG_FEATURE_KEYS`, so a key missing from that array will not typecheck in a
theme config -- whether you set it to `true` or `false`.

Leave every entry at `false` for now. `false` changes nothing -- it means "defer
to the PostHog flag". Flipping one to `true` is the go-live step, and it is
described under [Enable for everyone](#enable-for-everyone).

If you do not need that switch, skip this step and leave the key in
`FEATURE_FLAG_KEYS` alone. You can add it later, when the feature is ready to go
live.

### 5. Make the flag appear at `/_feature-flags`

`/_feature-flags` does not list the keys in your code. It renders a single
button that opens PostHog's own site-app widget, which lists **early access
features**, not raw feature flags.

So a flag at 0% rollout will not appear there until it is also registered as an
early access feature in PostHog:

1. Go to **Early Access Management** in PostHog (EU Cloud projects are at
   `eu.posthog.com/early_access_features`).
2. Create a feature, giving it a name and description -- this is the text shown
   in the widget.
3. Link it to the **existing flag** from step 1 rather than letting PostHog
   create a new one, or the key will not match what the code reads.
4. Set the stage to **Beta** (or Alpha).

Features start in **Draft**, which is not visible to users and does not change
the flag. Only Alpha, Beta and General availability appear in the widget and
enable the flag for opted-in users. (Concept appears under "Coming soon" but
deliberately does not enable the flag.)

Opting in through the widget is an overriding condition, so it enables the flag
for that user regardless of the 0% rollout.

Two things to know when testing:

- The widget's list is cached per browser load, so refresh the page after
  changing anything in PostHog.
- The widget needs cookie consent and no ad-blocker.

### Adding checklist

- [ ] PostHog flag created at 0% rollout
- [ ] Key added to `FEATURE_FLAG_KEYS`
- [ ] Feature gated on the key
- [ ] Route added to `routes.json`, if a new page
- [ ] Theme config entries added, if you want a per-theme go-live switch
- [ ] Registered as a PostHog early access feature, stage Beta
- [ ] Verified in a browser

## Enable a feature

There are two different things people mean by "turn the flag on", and they are
not interchangeable.

### Enable for yourself

This is previewing: the feature switches on in your browser only, nobody else is
affected, and nothing is deployed. Use it to review work in a review app or in
production before it goes live.

Once the early access feature exists
([step 5](#5-make-the-flag-appear-at-_feature-flags)), open `/_feature-flags`
and toggle it.

To test without waiting on PostHog -- useful in review apps -- set the cookie
directly in the browser console:

```js
document.cookie = 'feature_flags={"your-flag-key":true};path=/';
location.reload();
```

`getFeatureFlags` (`src/utils/featureFlags.ts`) reads the `feature_flags` cookie
and ignores any key not in `FEATURE_FLAG_KEYS`, so the key must already be
registered for this to work.

### Enable for everyone

This is going live: the feature switches on for every user of an app,
permanently, and **overrides PostHog entirely**. It takes a PR and a deploy, and
undoing it takes another deploy -- you cannot pull it back from PostHog.

Each theme config at `themes/<theme>/config.ts` has a `features` object mapping
feature keys to booleans:

```ts
features: {
  "climate-cop31-2026": false,
  familyConceptsSearch: false,
  knowledgeGraph: true,
  "new-search": true,
  // ...
},
```

`false` means "defer to the PostHog feature flag" -- it does not mean off. Only
`true` is decisive. To roll the feature out, change its entry to `true`, raise a
PR, and deploy that theme.

To do this the key must be in `CONFIG_FEATURE_KEYS` as well as
`FEATURE_FLAG_KEYS`. If you added it when you created the flag, it is already
there. If not, add it now, along with an entry in **every** theme's `features`
object -- `TConfigFeatures` is derived from `CONFIG_FEATURE_KEYS`, so a missing
entry fails `npm run type-check`.

⚠️ **Themes are separate apps.** The four themes (`ccc`, `cclw`, `cpr`, `mcf`)
each have their own config and deploy independently, so setting `true` in one
changes only that app. Double-check which config you are editing. To go live
everywhere, set `true` in all four.

Once a feature is `true` in every theme and you have no intention of turning it
back off, the flag has served its purpose -- retire it, see
[Delete](#delete-a-feature-flag).

## Disable a feature

Turning a feature off, without removing the flag. How you do this -- and how
fast it takes effect -- depends entirely on how it was turned on.

| It is on because...                     | To turn it off                                             | Needs a deploy? |
| --------------------------------------- | ---------------------------------------------------------- | --------------- |
| I opted in at `/_feature-flags`         | Toggle it off there, or clear the `feature_flags` cookie   | No              |
| The PostHog flag has a rollout above 0% | Set the rollout back to 0%, or disable the flag in PostHog | No              |
| A theme config sets it to `true`        | Change it to `false`, raise a PR, deploy that theme        | **Yes**         |

The third row is the one that catches people out. A theme feature set to `true`
short-circuits `isFeatureEnabled` before PostHog is consulted, so **disabling
the PostHog flag does nothing** for an app that has gone live via config. There
is no emergency off switch for a config-enabled feature: it needs a revert and a
deploy.

If you need the option to kill a feature quickly after launch, keep it
flag-controlled -- a PostHog flag at a percentage rollout can be set back to 0%
in seconds -- rather than setting the theme config to `true`.

⚠️ Setting a theme feature from `true` back to `false` does not turn the feature
off outright: it hands control back to the PostHog flag. If that flag has a
rollout above 0%, or you are opted in via the widget, you will still see the
feature. Check both.

## Delete a feature flag

A flag is temporary. Once the work behind it is either live for everyone or
abandoned, remove it -- stale flags accumulate dead branches and make it unclear
what is actually running in production.

There are three ways a flag ends.

### Option A: the feature ships to everyone

The flag disappears entirely and the feature becomes unconditional.

1. Delete the key from `FEATURE_FLAG_KEYS` in `src/types/features.ts`.
2. Run `npm run type-check`. TypeScript will name every remaining reference,
   because `TFeature` is derived from those arrays -- a `requiredFeature` or a
   theme config entry using a removed key fails to compile, with the file and
   line. Work through the list.
3. Delete the gating itself, not just the key. Remove the `requiredFeature`
   line, and unwrap any `features.yourFlag && ...` conditionals so the feature
   renders unconditionally. Delete whatever branch handled the flag being off.
4. If the key is in `CONFIG_FEATURE_KEYS`, remove it from there and from every
   theme's `features` object too.
5. Archive or delete the flag and its early access feature in PostHog, so nobody
   toggles a key the code no longer reads.

### Option B: the feature is abandoned

Same as Option A, but delete the feature code along with the flag: the page, its
`routes.json` entry, the components only it used, and its tests. Removing the
flag while leaving the code behind is how dead pages survive for years.

### Option C: the flag graduates to a theme feature

Use this when a feature should be permanently on for some apps but not others.
The key moves from `FEATURE_FLAG_KEYS` to `CONFIG_FEATURE_KEYS`, and each theme
config sets it `true` or `false` -- see
[Enable for everyone](#enable-for-everyone) for that config change.
`knowledgeGraph` went through exactly this transition and is now config-only.

⚠️ This changes what CI tests. `E2E_TEST_FEATURE_FLAGS=true` force-enables
everything in `FEATURE_FLAG_KEYS` (except `debug`) and **does not touch**
`CONFIG_FEATURE_KEYS` -- see `getFeatures()` in `src/utils/features.ts`. A
feature that E2E tests exercised automatically while it was a flag will only be
tested afterwards in themes whose config sets it to `true`.

### Before you remove

- Check the flag's rollout in PostHog first. Removing the key from the code
  makes the feature unconditional for everyone, so confirm that is intended
  rather than inferring it from the flag being enabled for you.
- Grep for the key as a bare string. Most references are typed and the compiler
  will catch them, but strings in tests, Storybook stories, E2E specs and CI
  workflow files are not.
- Old `feature_flags` cookies in users' browsers may still name the removed key.
  That is harmless: `getFeatureFlags()` ignores any key not in
  `FEATURE_FLAG_KEYS`.

### Tidying up in PostHog

Do this only after the code change has deployed. While the key is still in
`FEATURE_FLAG_KEYS`, removing the flag in PostHog turns the feature off for
everyone who had opted in.

PostHog offers three options, in increasing severity.

**Disable** sets the flag inactive and changes nothing else -- targeting,
variants and payloads are kept. It stops evaluating for every consumer. Use it
to check nothing breaks before committing to removal, since it is trivially
reversible.

**Archive** hides the flag from the default list and keeps its configuration and
history. A flag must be disabled to be archived, so archiving an active flag
disables it in the same step. This is the usual end state for a flag whose
feature has shipped: the record survives, but it stops cluttering the list.

**Delete** is a soft delete. The flag stops being served and leaves the list,
but its configuration and history are retained, and it can be brought back with
**Restore feature flag** on the flag's page. PostHog also counts flags against a
per-team limit, so deleting genuinely dead flags frees capacity.

⚠️ PostHog **blocks deletion** while something still references the flag, and
tells you what. Most relevant here: a flag linked to an **early access feature**
cannot be deleted until that link is removed. If you followed step 6 when adding
the flag, delete or unlink the early access feature first.

Deletion is also blocked by a running experiment (draft, stopped and completed
are fine), a linked survey, session replay recording conditions, or another
active flag that depends on this one.

Removing the flag in PostHog is safe for our code even if the key lingers:
globally inactive flags are omitted from PostHog's response entirely, so
`/_feature-flags` never writes them to the `feature_flags` cookie, and
`DEFAULT_FEATURE_FLAGS` starts every key at `false`. The feature reads as off
rather than erroring.

### Removal checklist

- [ ] Confirmed the feature should be on (or gone) for everyone
- [ ] Key deleted from `FEATURE_FLAG_KEYS`, and `CONFIG_FEATURE_KEYS` if present
- [ ] Theme config entries removed
- [ ] `npm run type-check` passes, with all flagged references resolved
- [ ] Gating conditionals unwrapped, off-branches deleted
- [ ] Grepped for the key as a string in tests, stories and workflows
- [ ] Feature code and `routes.json` entry deleted, if abandoning
- [ ] Early access feature deleted or unlinked, if one was created
- [ ] PostHog flag disabled, then archived or deleted -- after the code deployed
