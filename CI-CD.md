# CI/CD Workflow Documentation: swedeb_frontend

## Overview

The swedeb_frontend project employs a fully automated CI/CD pipeline using GitHub Actions and semantic-release to handle versioning, building, and deployment of frontend assets. The workflow creates containerized frontend assets that are consumed by the swedeb-api Docker deployment.

## Architecture

### Frontend Build Process

- **Framework**: Vue.js 3 with Quasar Framework v2
- **Build Tool**: Quasar CLI with Webpack
- **Package Manager**: pnpm
- **Output**: Static SPA files in `dist/spa/` directory

### Container Strategy

- **Frontend Container**: Minimal `FROM scratch` Docker image containing only compiled static assets
- **API Integration**: swedeb-api Dockerfile consumes the frontend container via multi-stage build
- **Registry**: GitHub Container Registry (GHCR)

## Workflow Components

### 1. Trigger Mechanism

The CI/CD pipeline is triggered by:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

- **Automatic**: Any push to the `main` branch
- **Manual**: Via GitHub UI workflow dispatch

### 2. Conventional Commits Integration

The workflow relies on [Conventional Commits](https://www.conventionalcommits.org/) specification for automated versioning:

| Commit Type                    | Version Impact        | Example                          |
|--------------------------------|-----------------------|----------------------------------|
| `feat:`                        | Minor (1.0.0 → 1.1.0) | `feat: add search functionality` |
| `fix:`                         | Patch (1.0.0 → 1.0.1) | `fix: correct button alignment`  |
| `BREAKING CHANGE:`             | Major (1.0.0 → 2.0.0) | Includes breaking change footer  |
| `docs:`, `chore:`, `refactor:` | No release            | Documentation/maintenance        |

### 3. Semantic Release Configuration

Configuration in `.releaserc.yml` defines:

#### Release Rules

```yaml
releaseRules:
  - type: feature
    release: minor
  - type: docs
    scope: docs-*
    release: minor
  - type: docs
    release: false
  - type: data
    release: patch
  - type: ci
    scope: ci-*
    release: patch
  - type: chore
    release: false
```

#### Plugin Chain Execution Order

The `.releaserc.yml` defines six plugins that execute sequentially:

1. **@semantic-release/commit-analyzer**:

   - Analyzes commits since last release using conventional commits
   - Determines version bump type (major/minor/patch/none)
   - Uses custom release rules for special cases

2. **@semantic-release/release-notes-generator**:

   - Generates changelog from commit messages
   - Groups commits by type with custom emojis (🍕 Features, 🐛 Bug Fixes, etc.)
   - Sorts commits by subject and scope

3. **@semantic-release/changelog**:

   - Updates CHANGELOG.md with formatted release notes
   - Includes badges for conventional commits and semantic versioning

4. **@semantic-release/exec** (prepare phase):

   - Executes `.github/scripts/build-assets.sh ${nextRelease.version}`
   - Builds frontend and creates versioned tarball

5. **@semantic-release/git**:
   - Commits updated CHANGELOG.md back to repository
   - Uses commit message template with `[skip ci]`

Note: GitHub release creation has been moved to the workflow for consistency across all branches.

7. **@semantic-release/git**:
   - Commits updated CHANGELOG.md back to repository
   - Uses commit message template with `[skip ci]`

## Build Pipeline

### Complete Workflow Execution

The workflow executes as a single job called `release` with the following stages:

### Stage 1: Environment Setup

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0 # Required for semantic-release to analyze commit history

- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20

- name: Set up pnpm and install dependencies
  uses: pnpm/action-setup@v3
  with:
    version: 8
    run_install: true
```

### Stage 2: Semantic Release Execution

The entire build and release process is orchestrated by semantic-release through a single command:

```yaml
- name: Run semantic-release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    DOCKER_USERNAME: ${{ github.actor }}
    DOCKER_PASSWORD: ${{ secrets.GITHUB_TOKEN }}
  run: pnpm semantic-release
```

This executes the plugin chain defined in `.releaserc.yml` in the following order:

#### 2.1 Commit Analysis & Version Calculation

- **@semantic-release/commit-analyzer**: Analyzes commits since last release
- Determines version bump based on conventional commit types

#### 2.2 Release Notes Generation

- **@semantic-release/release-notes-generator**: Creates changelog from commit messages
- Uses configured sections and emojis for different commit types

#### 2.3 Changelog Update

- **@semantic-release/changelog**: Updates `CHANGELOG.md` file

#### 2.4 Asset Building (prepareCmd)

**Script**: `.github/scripts/build-assets.sh`

```bash
#!/bin/bash
set -e

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Version argument is missing!"
  exit 1
fi

echo "Preparing assets for version ${VERSION}..."

pnpm build

tar -czvf "dist/frontend-${VERSION}.tar.gz" -C dist/spa .

echo "Assets prepared: dist/frontend-${VERSION}.tar.gz"
```

**Process**:

1. Runs `pnpm build` (Quasar build process)
2. Compiles Vue.js SPA to `dist/spa/`
3. Creates versioned tarball `frontend-${VERSION}.tar.gz`

#### 2.5 GitHub Release Creation (Unified)

All GitHub releases are now created in the workflow using `gh` CLI for consistency.

**Process**:

1. **Prepare release metadata** step determines:
   - For **main branch**:
     - Uses semantic-release outputs for version and notes
     - Creates full release with version tag (`v1.2.3`)
     - References CHANGELOG.md for release notes
   - For **staging/test branches**:
     - Uses package.json version with branch suffix
     - Creates/updates pre-release with branch name as tag
     - Includes branch-specific build metadata

2. **Create or update GitHub release** step:
   - For **main**: Creates new versioned release with `--latest` flag
   - For **staging/test**: Creates or updates pre-release with `--prerelease` flag

**Asset Naming**:
- Main: `frontend-{VERSION}.tar.gz` (e.g., `frontend-1.2.3.tar.gz`)
- Staging: `frontend-{VERSION}-staging.tar.gz` (e.g., `frontend-1.2.3-staging.tar.gz`)
- Test: `frontend-{VERSION}-test.tar.gz` (e.g., `frontend-1.2.3-test.tar.gz`)

**Benefits of Unified Approach**:
- Single source of truth for release creation logic
- Consistent behavior across all branches
- Easier to maintain and modify
- Better visibility in workflow logs

#### 2.6 Final Git Operations (Main Branch Only)

- **@semantic-release/git**: Commits updated `CHANGELOG.md` back to repository
- Pushes version tag and updated files
- Commit message includes `[skip ci]` to prevent workflow recursion

## Integration with swedeb-api

### Runtime Asset Download

The swedeb-api backend downloads frontend assets at container startup instead of bundling them at build time.

**Environment Variable Configuration**:

```bash
FRONTEND_VERSION=latest  # or 'staging', 'test', or specific version like 'v1.2.3'
```

**Download Script**: `docker/download-frontend.sh`

**Process**:

1. Container starts via `entrypoint.sh`
2. Checks if frontend assets exist and match requested version
3. If needed, downloads tarball from GitHub releases:
   - `latest`: Fetches most recent tagged release
   - `staging`/`test`: Fetches from pre-release tags
   - Specific version: Fetches that version's release
4. Extracts tarball to `/app/public`
5. Starts API server

**Benefits**:

- Frontend and backend can be deployed independently
- No rebuild required to update frontend
- Backends can pin to specific frontend versions
- Faster backend builds (no frontend assets to copy)
- Smaller backend images

### Base Image Details

- **Base**: `ghcr.io/humlab/cwb-container:latest`
- **Foundation**: Python 3.12 with IMS Open Corpus Workbench (CWB) pre-installed
- **Purpose**: Provides backend API functionality with corpus linguistics tools

### Asset Integration

1. Frontend assets are downloaded at runtime from GitHub releases
2. API serves frontend from `/app/public` directory
3. Frontend version controlled via `FRONTEND_VERSION` environment variable
4. Version checking prevents redundant downloads on restarts

## Security and Permissions

### GitHub Token Permissions

```yaml
permissions:
  contents: write # to push tags, update changelog, and manage releases
  issues: write # to comment on issues
  pull-requests: write # to comment on PRs
```

Note: `packages: write` permission is no longer required as we no longer push Docker images to GHCR.

### Authentication

- Uses `GITHUB_TOKEN` (automatically provided by GitHub Actions)
- No external secrets required for standard workflow
- Container registry authentication via GitHub token

## Monitoring and Troubleshooting

### Workflow Status

- Monitor via GitHub Actions tab
- Semantic-release provides detailed logs for version determination
- Build failures are visible in individual step outputs

### Common Issues and Troubleshooting

1. **Commit Format Violations**:

   - **Issue**: Commits not following conventional format prevent releases
   - **Solution**: Use tools like commitizen or conventional commit linting
   - **Example**: `feat: add user authentication` vs `Added user login feature`

2. **Build Failures**:

   - **Issue**: Quasar build process fails during asset preparation
   - **Check**: pnpm build logs in semantic-release output
   - **Common causes**: Missing dependencies, syntax errors, memory limits

3. **Container Push Authentication**:

   - **Issue**: Docker login fails to GHCR
   - **Verify**: GitHub token has `packages: write` permission
   - **Debug**: Check DOCKER_USERNAME and DOCKER_PASSWORD environment variables

4. **Version Conflicts**:

   - **Issue**: Attempting to create existing version tag
   - **Resolution**: semantic-release automatically handles duplicate versions
   - **Behavior**: Will skip release if no releasable commits found

5. **Large Tarball Size**:

   - **Issue**: `frontend-*.tar.gz` exceeds GitHub release asset limits
   - **Monitor**: Current build size and optimize if necessary
   - **Solution**: Review Quasar build output for unnecessary assets

6. **Semantic Release Plugin Failures**:
   - **Issue**: Individual plugins may fail during execution
   - **Debug**: Enable debug mode with `DEBUG=semantic-release:*`
   - **Recovery**: Some plugins are idempotent and can be safely retried

### Release Artifacts

- **GitHub Releases**: Versioned with changelog and tarball assets
- **Container Images**: Available at `ghcr.io/humlab-swedeb/swedeb_frontend`
- **Tags**: Both specific version (`v1.2.3`) and `latest`
- **Tarball Assets**: `frontend-${VERSION}.tar.gz` containing compiled SPA files

## Development Workflow

### For Contributors

1. Create feature branch from `main`
2. Make changes following project conventions
3. Write conventional commit messages
4. Open PR to `main`
5. After merge, automated release triggers

### Local Testing

- Use `act` tool for local GitHub Actions testing
- Requires GitHub PAT with `repo`, `workflow`, `write:packages` scopes
- Command: `act -j release -s GITHUB_TOKEN="$(cat ~/.ghcr_token)"`

## Technical Considerations

### Performance Characteristics

- **Build Time**: Typical workflow execution ~3-5 minutes
- **Image Size**: Minimal `FROM scratch` containers (~10-50MB depending on frontend assets)
- **Registry Storage**: GHCR provides unlimited public package storage
- **Bandwidth**: Efficient layer caching for repeated builds

### Security Model

- **Token Scope**: Uses built-in `GITHUB_TOKEN` with minimal required permissions
- **Container Security**: Scratch-based images eliminate OS-level vulnerabilities
- **Supply Chain**: All dependencies managed through pnpm lock file
- **Access Control**: GHCR inherits repository permissions

### Scalability Factors

- **Concurrent Builds**: Single job prevents resource conflicts
- **Version Management**: Semantic versioning prevents conflicts
- **Storage Growth**: Old container images can be pruned periodically
- **Network Dependencies**: Relies on GitHub/GHCR availability

### Configuration Management

- **Environment Variables**: Minimal external configuration required
- **Version Pinning**: Node.js and pnpm versions explicitly specified
- **Plugin Versions**: Semantic-release plugins versioned in package.json
- **Build Reproducibility**: Lock files ensure consistent dependency resolution

## Benefits of This Approach

1. **Zero-Touch Releases**: Fully automated from commit to deployment
2. **Semantic Versioning**: Automatic version management based on commit semantics
3. **Lightweight Containers**: Minimal frontend-only images for efficient distribution
4. **Separation of Concerns**: Frontend and API can be versioned independently
5. **Audit Trail**: Complete changelog and release history
6. **Container Efficiency**: Multi-stage builds optimize final image size
7. **Developer Experience**: Simple workflow requiring only conventional commits
8. **Cost Efficiency**: Minimal CI/CD resource usage and free GHCR storage

## Workflow Execution Analysis

### Current State (October 2025)

Based on the CHANGELOG.md, the project has had several releases:

- **Latest Version**: v0.10.0 (June 6, 2025)
- **Initial Release**: v0.0.1 (April 19, 2025)
- **Active Development**: Semantic-release infrastructure established and functioning

### Key Workflow Characteristics

1. **Single Job Execution**: All steps run in one `release` job on `ubuntu-latest`
2. **Sequential Plugin Execution**: semantic-release plugins execute in defined order
3. **Environment Variables**: Workflow provides Docker credentials via environment
4. **Minimal Dependencies**: Only requires Node.js 20 and pnpm 8
5. **Full History Access**: `fetch-depth: 0` ensures complete git history for analysis

### Integration Points

The workflow creates two primary integration points:

1. **GitHub Releases**: For manual download and version tracking
2. **Container Registry**: For automated consumption by downstream services

### Validation and Testing

Local testing can be performed using:

```bash
# Test semantic-release logic without publishing
npx semantic-release --dry-run

# Test GitHub Actions workflow locally
act -j release -s GITHUB_TOKEN="$(cat ~/.ghcr_token)"
```

This workflow ensures consistent, reliable, and traceable deployment of frontend assets while maintaining clear separation between frontend compilation and backend API functionality.
