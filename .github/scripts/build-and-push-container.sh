#!/bin/bash
set -e

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Version argument is missing!"
  exit 1
fi

IMAGE_NAME="ghcr.io/${GITHUB_REPOSITORY}"

echo "Logging into GitHub Container Registry..."
echo "${DOCKER_PASSWORD}" | docker login ghcr.io -u "${DOCKER_USERNAME}" --password-stdin

echo "Building and pushing Container image for version ${VERSION}..."

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

docker push --all-tags "${IMAGE_NAME}"

echo "Container image published successfully."
