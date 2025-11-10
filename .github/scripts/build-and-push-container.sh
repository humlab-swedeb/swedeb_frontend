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

IMAGE_NAME="ghcr.io/${GITHUB_REPOSITORY}"


log "Logging into GitHub Container Registry..."
echo "${DOCKER_PASSWORD}" | docker login ghcr.io -u "${DOCKER_USERNAME}" --password-stdin

log "Building and pushing Container image for version ${VERSION}..."

# Dynamically create a simple Dockerfile and pipe it to docker build
# This avoids having a Dockerfile in the repo that is only for this step
cat <<EOF | docker build \
  --tag "${IMAGE_NAME}:${VERSION}" \
  --tag "${IMAGE_NAME}:latest" \
  -f - .
# This Dockerfile is generated on-the-fly.
FROM scratch
WORKDIR /app/public
COPY dist/spa .
EOF

# Report image size
IMAGE_SIZE=$(docker images --format "{{.Size}}" "${IMAGE_NAME}:${VERSION}" | head -n1)
log "Container image size: ${IMAGE_SIZE}"

docker push "${IMAGE_NAME}:${VERSION}"
docker push "${IMAGE_NAME}:latest"

log "Container image published successfully with tags: ${VERSION}, latest"
