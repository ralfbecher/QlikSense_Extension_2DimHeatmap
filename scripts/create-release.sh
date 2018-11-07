#!/bin/bash
set -o errexit

echo "Creating release for version: $VERSION"
echo "Artifact name: ./build/${3}_v${VERSION}.zip"
$HOME/bin/ghr -t ${ghoauth} -u ${CIRCLE_PROJECT_USERNAME} -r ${CIRCLE_PROJECT_REPONAME} -c ${CIRCLE_SHA1} -delete ${VERSION} "./build/${3}_v${4}.zip"


# Usage
# $ create-release.sh qlik-oss qsSimpleKPI qlik-multi-kpi 0.3.1
