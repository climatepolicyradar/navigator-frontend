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

- Node.js (v18 or higher)
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

Run tests:

```bash
# Unit tests
npm run test

# E2E tests
npm run test-e2e
```

## 🏭 Deployment

Containers are automatically:

1. Built and tested via GitHub Actions
2. Pushed to AWS ECR
3. Deployed via [navigator-infra](https://github.com/climatepolicyradar/navigator-infra)

## 🎨 Theming

Themes are configured in `themes/[theme-name]/config.ts`. Each theme can override:

- Styling
- Feature flags
- Environment-specific configurations

## 🏴‍☠️ Feature flags

### Theme features

We have the ability to turn features on per theme. These are controlled via the
[`themeConfig.features`](./src/types/themeConfig.ts#l75).

These are accessed via [`./src/utils/features.ts`](./src/utils/features.ts).

## 📜 License

This project is licensed under the terms specified in [LICENSE.md](LICENSE.md).
