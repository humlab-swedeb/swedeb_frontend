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

ENVIRONMENT=${2:-production}
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
  log "ERROR: Environment must be 'staging' or 'production'. Got: $ENVIRONMENT"
  exit 1
fi

IMAGE_NAME="ghcr.io/${GITHUB_REPOSITORY}"

# Set image tag based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
  IMAGE_TAG="staging"
  IMAGE_VERSION_TAG="staging-${VERSION}"
else
  IMAGE_TAG="latest"
  IMAGE_VERSION_TAG="${VERSION}"
fi

log "Building ${ENVIRONMENT} frontend image for version ${VERSION}..."
log "Logging into GitHub Container Registry..."
echo "${DOCKER_PASSWORD}" | docker login ghcr.io -u "${DOCKER_USERNAME}" --password-stdin

# Build the frontend
log "Building frontend application..."
pnpm build

# Validate build output
if [ ! -d "dist/spa" ] || [ -z "$(ls -A dist/spa)" ]; then
    log "ERROR: Build output is empty or missing!"
    exit 1
fi

log "Building and pushing container image..."

log "Building ${ENVIRONMENT} image with tags: ${IMAGE_TAG}, ${IMAGE_VERSION_TAG}"
# Dynamically create a simple Dockerfile and pipe it to docker build
cat <<EOF | docker build \
  --tag "${IMAGE_NAME}:${IMAGE_TAG}" \
  --tag "${IMAGE_NAME}:${IMAGE_VERSION_TAG}" \
  -f - .
# This Dockerfile is generated on-the-fly.
FROM scratch
WORKDIR /app/public
COPY dist/spa .
EOF

# Report image size
IMAGE_SIZE=$(docker images --format "{{.Size}}" "${IMAGE_NAME}:${IMAGE_TAG}" | head -n1)
log "Container image size: ${IMAGE_SIZE}"

docker push "${IMAGE_NAME}:${IMAGE_TAG}"
docker push "${IMAGE_NAME}:${IMAGE_VERSION_TAG}"
log "Container image published successfully with tags: ${IMAGE_TAG}, ${IMAGE_VERSION_TAG}"
