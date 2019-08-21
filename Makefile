#!make

include .env

STAGE_ENV    ?=development
PROJECT_NAME ?=isotope
COMPOSE_FILE ?=docker-compose.${STAGE_ENV}.yml
PACKAGE      ?=SeanMorris/Isotope
REPO         ?=r.cfcr.io/seanmorris
TAG          ?=latest

DOCKER_HOST_IP=`docker network inspect bridge --format="{{ (index .IPAM.Config 0).Gateway}}"`
DOCKER_COMMAND= export DOCKER_HOST_IP=${DOCKER_HOST_IP} REPO=${REPO} TAG=${TAG} `cat ../.env | tr '\n' ' '` \
	&& docker-compose -f docker-compose/${COMPOSE_FILE} -p ${PROJECT_NAME}

EXTERNAL_IP=`minikube ip`

build:
	@ echo "Building ${PROJECT_NAME} ${STAGE_ENV}..." \
	&& touch .env \
	&& cd infra/ \
	&& docker run --rm -v `pwd`/../:/app \
		composer install --ignore-platform-reqs \
			--no-interaction \
			--prefer-source \
	&& docker build ../vendor/seanmorris/subspace/infra/ \
		-f ../vendor/seanmorris/subspace/infra/socket.Dockerfile \
		-t basic-socket:latest \
	&& ${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml build worker \
	&& ${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml build watcher \
	&& cd .. \
	&& ( \
		[ "${STAGE_ENV}" == "development" ] || \
		make build-js COMPOSE_FILE=docker-compose.base.yml \
	) \
	&& cd infra/ \
	&& ${DOCKER_COMMAND} build \

clean:
	@ cd infra/; \
	${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml run --rm \
		task rm -rf ../vendor; \
	${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml run --rm \
		task rm -rf ../frontend/node_modules; \
	${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml run --rm \
		task rm -f ../frontend/public/app.* index.html; \
	cd ..; \
	make clear-log

host-ip:
	echo ${DOCKER_HOST_IP}

link:
	cd infra/; \
	${DOCKER_COMMAND} run --rm \
		worker idilic link

curv:
	cd curvature/; \
	npm run build; \
	brunch build -p;

curv-link:
	mount --bind /home/sean/curvature-2 curvature

push-images:
	cd infra/ \
	&& ${DOCKER_COMMAND} push

pull-images:
	cd infra/ \
	&& ${DOCKER_COMMAND} pull

start:
	cd infra/ \
	&& ${DOCKER_COMMAND} up -d

stop:
	cd infra/ \
	&& ${DOCKER_COMMAND} down

stop-all:
	cd infra/ \
	&& ${DOCKER_COMMAND} down --remove-orphans

restart:
	cd infra/ \
	&& ${DOCKER_COMMAND} down \
	&& ${DOCKER_COMMAND} up -d

restart-fg:
	cd infra/ \
	&& ${DOCKER_COMMAND} down \
	&& ${DOCKER_COMMAND} up

restart-socket:
	cd infra/ \
	&& ${DOCKER_COMMAND} restart socket

restart-watcher:
	cd infra/ \
	&& ${DOCKER_COMMAND} restart watcher

composer-install:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		compose composer install

composer-update:
	cd infra/ \
	&& ${DOCKER_COMMAND}  run --rm \
		compose composer update

watch-log:
	cd temporary/ \
	&& less -RSXMNI +F log.txt

clear-log:
	cd temporary/ \
	&& echo "" > log.txt

store-schema:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		worker idilic storeSchema ${PACKAGE}

apply-schema:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		worker idilic applySchemas 1

CMD?=info

idilic:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		 worker idilic ${CMD}

build-js:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm watcher npm install \
	&& ${DOCKER_COMMAND} run --rm watcher brunch build -p

watch-js:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm watcher npm install \
	&& ${DOCKER_COMMAND} run --rm -p 9485:9485 watcher brunch watch -s

generate-ssl:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm -p 443:443 -p 80:80 \
		certbot \
		certonly --standalone --preferred-challenges http \
		-d thewhtrbt.com \
		--agree-tos -m sean@seanmorr.is

renew-ssl:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		certbot \
		renew

cluster-apply:
	export EXTERNAL_IP=${EXTERNAL_IP} \
	&& kubectl apply -f infra/kubernetes/mysql.deployment.k8s.yml \
	&& kubectl apply -f infra/kubernetes/mysql.service.k8s.yml \
	&& kubectl apply -f infra/kubernetes/http.deployment.k8s.yml \
	&& kubectl apply -f infra/kubernetes/http.service.k8s.yml \
	&& kubectl apply -f infra/kubernetes/socket.deployment.k8s.yml \
	&& kubectl apply -f infra/kubernetes/socket.service.k8s.yml \
	&& kubectl apply -f infra/kubernetes/updater.job.k8s.yml \
	&& cat infra/kubernetes/socket.ingress.k8s.yml | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/http.ingress.k8s.yml   | envsubst | kubectl apply -f -

cluster-delete:
	export EXTERNAL_IP=${EXTERNAL_IP} \
	; kubectl delete ingress backend socket \
	; kubectl delete deployment,service database backend socket \
	; kubectl delete job updater
