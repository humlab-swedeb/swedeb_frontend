#!/bin/bash
set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" >&2
}

VERSION=$1
if [ -z "$VERSION" ]; then
    log "ERROR: Version argument is missing!"
    exit 1
fi

log "Preparing assets for version ${VERSION}..."

pnpm build

# Validate build output
if [ ! -d "dist/spa" ] || [ -z "$(ls -A dist/spa)" ]; then
    log "ERROR: Build output is empty or missing!"
    exit 1
fi

# Create tarball
tar -czvf "dist/frontend-${VERSION}.tar.gz" -C dist/spa .

# Verify tarball was created
if [ ! -f "dist/frontend-${VERSION}.tar.gz" ]; then
    log "ERROR: Failed to create tarball!"
    exit 1
fi

TARBALL_SIZE=$(du -h "dist/frontend-${VERSION}.tar.gz" | cut -f1)
log "Assets prepared: dist/frontend-${VERSION}.tar.gz (${TARBALL_SIZE})"
