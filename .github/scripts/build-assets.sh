#!/bin/bash
set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" >&2
}

VERSION=$1
ENVIRONMENT=${2:-production}

if [ -z "$VERSION" ]; then
    log "ERROR: Version argument is missing!"
    exit 1
fi

if [[ ! "$ENVIRONMENT" =~ ^(production|staging|test)$ ]]; then
    log "ERROR: Environment must be 'production', 'staging', or 'test'. Got: $ENVIRONMENT"
    exit 1
fi

log "Preparing assets for version ${VERSION} (${ENVIRONMENT})..."

# Build the frontend
pnpm build

# Validate build output
if [ ! -d "dist/spa" ] || [ -z "$(ls -A dist/spa)" ]; then
    log "ERROR: Build output is empty or missing!"
    exit 1
fi

# Create tarball with appropriate naming
if [ "$ENVIRONMENT" = "production" ]; then
    TARBALL="frontend-${VERSION}.tar.gz"
else
    # staging or test
    TARBALL="frontend-${VERSION}-${ENVIRONMENT}.tar.gz"
fi

tar -czvf "dist/${TARBALL}" -C dist/spa .

# Verify tarball was created
if [ ! -f "dist/${TARBALL}" ]; then
    log "ERROR: Failed to create tarball!"
    exit 1
fi

TARBALL_SIZE=$(du -h "dist/${TARBALL}" | cut -f1)
log "✅ Assets prepared: dist/${TARBALL} (${TARBALL_SIZE})"
