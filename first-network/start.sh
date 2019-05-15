IMAGE_TAG="latest" ../vendor/docker/docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml up -d 2>&1
../vendor/docker/docker exec cli scripts/script.sh prontuchain 3 node 10 false