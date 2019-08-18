#!make

include .env

STAGE_ENV    ?=development
PROJECT_NAME ?=isotope
COMPOSE_FILE ?=docker-compose.${STAGE_ENV}.yml
PACKAGE      ?=SeanMorris/Isotope
REPO         ?=r.cfcr.io/seanmorris
TAG          ?=latest

# DOCKER_HOST_IP=`docker network inspect bridge --format="{{ (index .IPAM.Config 0).Gateway}}"`
# DOCKER_COMMAND= export DOCKER_HOST_IP=${DOCKER_HOST_IP} \
# 	&& docker-compose -f ${COMPOSE_FILE} \
# 	 -p ${PROJECT_NAME}

DOCKER_COMMAND= export REPO=${REPO} TAG=${TAG} `cat ../.env | tr '\n' ' '` \
	&& docker-compose -f ${COMPOSE_FILE} -p ${PROJECT_NAME}

# it:
# 	cd infra/; \
# 	${DOCKER_COMMAND} run  --rm \
# 		updater.isotope.seanmorr.is composer install; \
# 	${DOCKER_COMMAND} run  --rm \
# 		worker.isotope.seanmorr.is brunch build -p;

build:
	touch .env \
	&& cd infra/ \
	&& ${DOCKER_COMMAND} build worker.isotope.seanmorr.is \
	&& ${DOCKER_COMMAND} -f docker-compose.base.yml run --rm \
		compose.isotope.seanmorr.is composer install \
	&& docker build ../vendor/seanmorris/subspace/infra/ \
		-f ../vendor/seanmorris/subspace/infra/socket.Dockerfile \
		-t basic-socket:latest \
	&& ${DOCKER_COMMAND} build worker.isotope.seanmorr.is \
	&& ${DOCKER_COMMAND} -f docker-compose.base.yml build watcher.isotope.seanmorr.is \
	&& cd .. \
	&& make build-js COMPOSE_FILE=docker-compose.base.yml \
	&& make build-js COMPOSE_FILE=docker-compose.base.yml \
	&& cd infra/ \
	&& ${DOCKER_COMMAND} build \

clean:
	cd infra/; \
	${DOCKER_COMMAND} -f docker-compose.base.yml run --rm \
		task.isotope.seanmorr.is rm -rf ../vendor; \
	${DOCKER_COMMAND} -f docker-compose.base.yml run --rm \
		task.isotope.seanmorr.is rm -rf ../frontend/node_modules; \
	${DOCKER_COMMAND} -f docker-compose.base.yml run --rm \
		task.isotope.seanmorr.is rm -f ../frontend/public/app.* index.html; \
	cd ..; \
	make clear-log

host-ip:
	echo ${DOCKER_HOST_IP}

link:
	cd infra/; \
	${DOCKER_COMMAND} run --rm \
		worker.isotope.seanmorr.is idilic link

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
	&& ${DOCKER_COMMAND} restart socket.isotope.seanmorr.is

restart-watcher:
	cd infra/ \
	&& ${DOCKER_COMMAND} restart watcher.isotope.seanmorr.is

composer-install:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		compose.isotope.seanmorr.is composer install

composer-update:
	cd infra/ \
	&& ${DOCKER_COMMAND}  run --rm \
		compose.isotope.seanmorr.is composer update

watch-log:
	cd temporary/ \
	&& less -RSXMNI +F log.txt

clear-log:
	cd temporary/ \
	&& echo "" > log.txt

store-schema:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		worker.isotope.seanmorr.is idilic storeSchema ${PACKAGE}

apply-schema:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		worker.isotope.seanmorr.is idilic applySchemas 1
CMD?=info

idilic:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		 worker.isotope.seanmorr.is idilic ${CMD}

build-js:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm watcher.isotope.seanmorr.is npm install \
	&& ${DOCKER_COMMAND} run --rm watcher.isotope.seanmorr.is brunch build -p

watch-js:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm watcher.isotope.seanmorr.is npm install \
	&& ${DOCKER_COMMAND} run --rm -p 9485:9485 watcher.isotope.seanmorr.is brunch watch -s

generate-ssl:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm -p 443:443 -p 80:80 \
		certbot.isotope.seanmorr.is \
		certonly --standalone --preferred-challenges http \
		-d thewhtrbt.com \
		--agree-tos -m sean@seanmorr.is

renew-ssl:
	cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		certbot.isotope.seanmorr.is \
		renew
