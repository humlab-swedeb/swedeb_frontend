# Deprecated Scripts

This directory contains deprecated scripts that are no longer used in the current CI/CD pipeline.

## build-and-push-container.sh

**Deprecated**: April 2026

**Previous Purpose**: Built and pushed a "from scratch" Docker image containing only frontend assets to GHCR. The backend would pull this image and copy assets during its build process.

**Replacement**: The frontend now creates tarball release artifacts (`.tar.gz` files) that are attached to GitHub releases. The backend pulls and unpacks these at runtime using the `download-frontend.sh` script.

**Why Changed**:
- Simpler architecture - no need to pull Docker images just for static files
- More efficient - tarballs are smaller and faster to download
- Better separation - frontend releases are independent of Docker registry
- Runtime flexibility - backends can fetch specific versions without rebuilding

**Migration Impact**: Backend containers now use `download-frontend.sh` in their entrypoint to fetch frontend assets at startup instead of copying from a Docker image during build.
