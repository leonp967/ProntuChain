export PATH=${PWD}/../bin:${PWD}:$PATH
docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml down --volumes --remove-orphans
docker run -v $PWD:/tmp/first-network --rm hyperledger/fabric-tools:"latest" rm -Rf /tmp/first-network/ledgers-backup
CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /dev-peer0.org1.example.com-recordcontract*/) {print $1}')
docker rm -f $CONTAINER_IDS
DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer0.org1.example.com-recordcontract*/) {print $3}')
docker rmi -f $DOCKER_IMAGE_IDS