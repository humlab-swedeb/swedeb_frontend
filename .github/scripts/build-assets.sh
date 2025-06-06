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
