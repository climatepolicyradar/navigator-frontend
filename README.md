# Navigator Frontend

[![Build Status](https://github.com/climatepolicyradar/navigator-frontend/workflows/CI/badge.svg)](https://github.com/climatepolicyradar/navigator-frontend/actions)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=YOUR_BADGE_KEY)](https://automate.browserstack.com/public-build/YOUR_BADGE_KEY)

A modern, theme-capable frontend application for the Climate Policy Radar Navigator
platform. This repository contains the code necessary to build and deploy the
`navigator-frontend` container.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run development server (default theme)
npm run dev

# Run with specific theme
THEME=cclw npm run dev
```

## 📋 Prerequisites

- Node.js (v22 or higher)
- Docker
- Make
- [Trunk.io](https://trunk.io) for code quality

First-time setup:

```bash
make install_trunk  # Only if trunk.io not already installed
```

## 🏗️ Development

### Local Development Options

1. **Docker (recommended)**

   ```bash
   make        # Default theme
   # or
   make THEME=cclw
   ```

2. **Manual Setup**

   ```bash
   npm install
   npm run dev
   ```

### Environment Configuration

Configuration is managed through environment variables. See `.env.example` for all
available options.

Key variables:

- `THEME`: Set the active theme (e.g., 'cclw', 'default')
- `API_URL`: Backend API endpoint
- `AUTH_URL`: Authentication service URL

## 🧪 Testing

This project uses:

- Vitest for unit testing
- Playwright for E2E testing
- BrowserStack for cross-browser testing
- Act for GitHub workflows debugging/testing (click here for [our act scripts](.github/workflows/scripts/))

Run tests:

```bash
# Unit tests
npm run test

# E2E tests
npm run test-e2e
```

## 🏭 Deployment

- Go to the [Deploy all to production](https://github.com/climatepolicyradar/navigator-frontend/actions/workflows/deploy-all-production.yml)
  GitHub action OR 👇
- Go to the [Deploy to production](https://github.com/climatepolicyradar/navigator-frontend/actions/workflows/deploy-production.yml)
  GitHub action
- You can only deploy from from `main`
- Select the app you want to deploy
- "Run workflow"

This builds and pushes to the ECR `latest` tag which then
[automatically triggers a deploy](https://docs.aws.amazon.com/apprunner/latest/dg/manage-deploy.html).

### 🔔 I've merged a buggy commit into `main`

No worries. Just disable the deployment actions above and let people know in the
`#application` and `#engineering` Slack channels.

![How to disable Github actions from the GitHub UI](./docs/images/disable-production-deployments.png)

### 🔙 Rollback

- To rollback find [the merge commit](https://github.com/climatepolicyradar/navigator-frontend/commits/main/)
  which will have a corresponding ECR container built
- use the navigator-infra [Deploy frontend GitHub action](https://github.com/climatepolicyradar/navigator-infra/actions/workflows/deploy-frontend.yml)
  to deploy the SHA

## 🎨 Theming

Themes are configured in `themes/[theme-name]/config.ts`. Each theme can override:

- Styling
- Feature flags
- Environment-specific configurations

## 🏴‍☠️ Features

There are three different methods used in the app to control which feature set\
a given user sees. These work in tandem and are designed to overlap, which is\
possible by using the same key for multiple types.

| Method:                   | A/B test                                                               | Feature flag                                                              | Theme feature                                                      |
| ------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Use:                      | Rolling an experimental feature out to a proportion of users.          | Previewing an upcoming feature or developing a new feature in production. | Making features available on a per-app basis, typically long term. |
| Configured at:            | PostHog feature flag with % rollout                                    | PostHog feature flag with 0% rollout + PostHog early access feature       | `/themes/<THEME>/config.ts` `features` object                      |
| Add key to:               | `/src/types/features.ts` `abTestKeys`                                  | `/src/types/features.ts` `featureFlagKeys`                                | `/src/types/features.ts` `configFeatureKeys`                       |
| Manually enable via:      | `/_feature-flags` only if also added as a PostHog early access feature | `/_feature-flags`                                                         | Theme config file (above)                                          |
| Can be on by default:     | Yes                                                                    | No                                                                        | Yes                                                                |
| Client-side only:         | Yes                                                                    | No                                                                        | No                                                                 |
| Get value via:            | `getFeaturesWithABTests()`                                             | `getFeatures()`                                                           | `getFeatures()`                                                    |
| Persist client-side with: | `FeaturesContext`                                                      | `FeaturesContext`                                                         | `FeaturesContext`                                                  |

An example of intentionally overlapping keys:

`knowledgeGraph` was a key used both as a feature flag and as a theme feature\
(added to both key arrays). When one was on, the feature was on, so it could be\
on for all users on specific apps using the theme feature, and on other apps\
turned on manually through the feature flags page to preview it.

## 📜 License

This project is licensed under the terms specified in [LICENSE.md](LICENSE.md).
