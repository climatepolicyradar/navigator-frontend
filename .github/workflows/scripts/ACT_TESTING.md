# 🧪 Testing Pull Request Workflow with Act

GitHub debugging tools for your CI woes using `act`.

More information on other forms of testing in this repo can be found in our [README](../../../README.md).

## Prerequisites

1. **Install act**: `brew install act` (macOS) or visit [nektos/act](https://github.com/nektos/act)
2. **Docker**: act requires Docker to run GitHub Actions locally

## Quick Start

### Interactive Test Script

```bash
./debug-pull-request-workflow.sh
```

This provides an interactive menu to test individual jobs, dry running each
first.

## Manual Testing

The `pull_request` here refers to the event that should trigger the GitHub
workflow.

### List Available Jobs

```bash
act pull_request --list
```

### Test Specific Job in workflow (Dry Run)

```bash
act pull_request --workflows .github/workflows/pull_request.yml --job test --dryrun
```

### Test Specific Job in workflow (Full Execution)

```bash
act pull_request --workflows .github/workflows/pull_request.yml --job test
```

### Test all workflows with Verbose Output

```bash
act pull_request --job test --verbose
```

## Common Issues & Solutions

### 1. Missing .env File

The workflow expects `.env.example` but it doesn't exist. The scripts create a
minimal `.env` file.

### 2. Node.js Version

The workflow uses Node.js 22.12.0. Ensure your local environment matches or act
will use the container.

### 3. Dependencies

Some jobs require external services (Lighthouse CI, Percy, etc.). These will
fail locally without proper tokens.

### 4. Matrix Jobs

Jobs like `lhci-desktop` and `lhci-mobile` run matrix builds. Test with:

```bash
act pull_request --workflows .github/workflows/pull_request.yml --job lhci-desktop --matrix theme:cpr
```

## Job Descriptions

- **size**: Bundle size checking with size-limit
- **lhci-desktop**: Lighthouse CI desktop performance tests
- **lhci-mobile**: Lighthouse CI mobile performance tests
- **percy**: Visual regression testing
- **code-quality**: Trunk.io code quality checks + TypeScript
- **test**: Unit tests with Vitest
- **test-e2e**: End-to-end tests with Playwright

## Troubleshooting

### Act Fails to Start

```bash
# Check Docker is running
docker ps

# Check act version
act --version
```

### Job Fails with Secrets

Many jobs require GitHub secrets. You can mock them:

```bash
act pull_request --job test --secret-file .secrets
```

### Environment Variables

Create a `.secrets` file for testing:

```env
GITHUB_TOKEN=your-token
LHCI_GITHUB_APP_TOKEN=your-lighthouse-token
PERCY_TOKEN=your-percy-token
```

## Most Likely Culprits

Based on the workflow analysis, the most common failure points are:

1. **test job**: Unit tests failing (vitest)
2. **code-quality job**: Trunk.io or TypeScript errors
3. **lhci-\* jobs**: Missing Lighthouse CI tokens
4. **percy job**: Missing Percy token or visual regressions
5. **test-e2e\* jobs**: App behaviour regression (playright)

Start with the `test` job as it's the most straightforward to debug locally.
