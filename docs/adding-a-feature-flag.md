# Adding a feature flag

How to put new work behind a PostHog feature flag, from registering the key to
seeing it switched on in a browser.

This covers the "Feature flag" column of the features table in the Features
section of [README.md](../README.md) -- a PostHog flag at 0% rollout, used to
preview or develop something in production without exposing it to users. To turn
an existing feature on permanently for a whole app instead, see
[turn-on-ff-though-config.md](turn-on-ff-though-config.md).

## 1. Create the flag in PostHog

Create a feature flag whose key exactly matches the key you will add to the code
in step 2, and set its rollout to **0%**. At 0% nobody gets the flag by default,
so the work stays hidden until someone opts in.

## 2. Register the key in the app

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
mechanisms (see step 5).

## 3. Gate the feature on the key

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

## 4. Register the route, if you added a page

Pages under `themes/<THEME>/pages/` are **not** routed by file path. They are
served by the dynamic route at `src/pages/[page].tsx`, whose `getStaticPaths`
builds its list solely from `themes/<THEME>/routes.json` with `fallback: false`.

A page with no entry in that file is never generated, and its URL returns a real
404 -- not the feature-flag 404. Add an entry:

```json
{
  "title": "Your Page Title",
  "path": "your-page",
  "contentPath": "your-page"
}
```

`path` is the URL segment (`/your-page`) and `contentPath` is the filename in
`themes/<THEME>/pages/` without its extension. Confirm it worked by building the
theme and checking the page is emitted:

```sh
THEME=<theme> npx next build
ls .next/server/pages/your-page.html
```

Also check `themes/<THEME>/rewrites.json` and `redirects.json` in case the path
you chose is already shadowed.

## 5. Optionally add a per-theme switch

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

Setting it to `false` changes nothing: `isFeatureEnabled`
(`src/utils/features.ts`) falls through to the PostHog flag. Setting it to
`true` returns early and turns the feature on permanently for that theme,
**overriding PostHog entirely**. That cannot be undone from PostHog; it takes
another deploy.

If you do not need that switch, skip this step and leave the key in
`FEATURE_FLAG_KEYS` alone.

## 6. Make the flag appear at `/_feature-flags`

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

## 7. Enable it in a browser

Once the early access feature exists, open `/_feature-flags` and toggle it.

To test without waiting on PostHog -- useful in review apps -- set the cookie
directly in the browser console:

```js
document.cookie = 'feature_flags={"your-flag-key":true};path=/';
location.reload();
```

`getFeatureFlags` (`src/utils/featureFlags.ts`) reads the `feature_flags` cookie
and ignores any key not in `FEATURE_FLAG_KEYS`, so the key must already be
registered in step 2 for this to work.

## Checklist

- [ ] PostHog flag created at 0% rollout
- [ ] Key added to `FEATURE_FLAG_KEYS`
- [ ] Feature gated on the key
- [ ] Route added to `routes.json`, if a new page
- [ ] Theme config entries added, if you want a per-theme go-live switch
- [ ] Registered as a PostHog early access feature, stage Beta
- [ ] Verified in a browser
