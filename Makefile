#!make

include .env

STAGE_ENV    ?=development
PROJECT_NAME ?=isotope
COMPOSE_FILE ?=docker-compose.${STAGE_ENV}.yml
PACKAGE      ?=SeanMorris/Isotope
# REPO         ?=r.cfcr.io/seanmorris
# REPO_CREDS   ?=regcred

# REPO         =seanmorris
HOST         =seanmorr.is
HOST         =127.0.0.1.nip.io
REPO         ?=gcr.io/my-project-1550542132420
REPO_CREDS   ?=gcr-json-key

TAG          ?=latest
DOCKER_HOST_IP=`docker network inspect bridge --format="{{ (index .IPAM.Config 0).Gateway}}"`
DOCKER_COMMAND= export \
	DOCKER_HOST_IP=${DOCKER_HOST_IP} \
	REPO_CREDS=${REPO_CREDS} \
	REPO=${REPO} \
	HOST=${HOST} \
	TAG=${TAG} \
	`cat ../.env | tr '\n' ' '` \
		&& docker-compose -f docker-compose/${COMPOSE_FILE} -p ${PROJECT_NAME}

EXTERNAL_IP=`minikube ip`

it:
	@ echo "Building ${PROJECT_NAME} ${STAGE_ENV}..." \
	&& make dependencies \
	&& make build

build:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml build worker \
	&& ${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml build watcher \
	&& cd .. \
	&& ( \
		[[ "${STAGE_ENV}" == "development" ]] || \
		make build-js COMPOSE_FILE=docker-compose.base.yml \
	) \
	&& cd infra/ \
	&& ${DOCKER_COMMAND} build \

dependencies:
	@ touch .env \
	&& cd infra/ \
	&& docker run --rm \
		-v `pwd`/../:/app \
		composer install --ignore-platform-reqs \
			--no-interaction \
			--prefer-source \
	&& docker build ../vendor/seanmorris/subspace/infra/ \
		-f ../vendor/seanmorris/subspace/infra/socket.Dockerfile \
		-t basic-socket:latest

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
	@ echo ${DOCKER_HOST_IP}

link:
	@ cd infra/; \
	${DOCKER_COMMAND} run --rm \
		worker idilic link

curv:
	@ cd curvature/; \
	npm run build; \
	brunch build -p;

curv-link:
	@ mount --bind /home/sean/curvature-2 curvature

push-images:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} push
# 	&& ${DOCKER_COMMAND} -f ../vendor/seanmorris/thruput/infra/docker-compose.yml push

pull-images:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} pull

start:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} up -d

start-fg:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} up

stop:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} down

stop-all:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} down --remove-orphans

restart:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} down \
	&& ${DOCKER_COMMAND} up -d

restart-fg:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} down \
	&& ${DOCKER_COMMAND} up

restart-socket:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} restart socket

restart-watcher:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} restart watcher

composer-install:
	@ cd infra/ \
	&& docker run -it- -rm \
		-v `pwd`/../:/app \
		composer install --ignore-platform-reqs \
			--prefer-source \

composer-update:
	@ cd infra/ \
	&& docker run -it --rm \
		-v `pwd`/../:/app \
		composer update --ignore-platform-reqs \
			--prefer-source
watch-log:
	@ cd temporary/ \
	&& less -RSXMNI +F log.txt

clear-log:
	@ cd temporary/ \
	&& echo "" > log.txt

store-schema:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		worker idilic storeSchema ${PACKAGE}

apply-schema:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		worker idilic applySchemas 1

CMD?=info

idilic:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		 worker idilic ${CMD}

build-js:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml build watcher \
	&& ${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml run --rm watcher rm -rf /app/frontend/node_modules/curvature \
	&& ${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml run --rm watcher npm install \
	&& ${DOCKER_COMMAND} -f docker-compose/docker-compose.base.yml run --rm watcher brunch build -p

watch-js:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} run --rm watcher npm install \
	&& ${DOCKER_COMMAND} run --rm -p 9485:9485 watcher brunch watch -s

generate-ssl:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} run --rm -p 443:443 -p 80:80 \
		certbot \
		certonly --standalone --preferred-challenges http \
		-d thewhtrbt.com \
		--agree-tos -m sean@seanmorr.is

renew-ssl:
	@ cd infra/ \
	&& ${DOCKER_COMMAND} run --rm \
		certbot \
		renew

# cluster-credetials:
# 	@ kubectl create secret generic regcred \
# 	    --from-file=.dockerconfigjson=${HOME}/.docker/config.json \
# 	    --type=kubernetes.io/dockerconfigjson;

# cluster-creds:
# 	cat ./.gcr_secret.json
cluster-credetials:
	cat ./.gcr_secret.json
	kubectl delete secret gcr-json-key \
	; kubectl create secret docker-registry gcr-json-key \
		--docker-server=https://gcr.io \
		--docker-username=_json_key \
		--docker-password="$$(cat ./.gcr_secret.json)" \
		--docker-email=sean@seanmorr.is

cluster-apply:
	export EXTERNAL_IP=${EXTERNAL_IP} REPO=${REPO} HOST=${HOST} REPO_CREDS=${REPO_CREDS} TAG=${TAG} \
	&& cat infra/kubernetes/mysql.deployment.k8s.yml   | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/mysql.service.k8s.yml      | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/rabbit.deployment.k8s.yml  | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/backend.deployment.k8s.yml | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/backend.service.k8s.yml    | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/socket.deployment.k8s.yml  | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/socket.service.k8s.yml     | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/updater.job.k8s.yml        | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/socket.ingress.k8s.yml     | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/backend.ingress.k8s.yml    | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/rabbit.service.k8s.yml     | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/load-balancer.deployment.k8s.yml   | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/load-balancer.service.k8s.yml      | envsubst | kubectl apply -f - \
	&& cat infra/kubernetes/load-balancer.ingress.k8s.yml      | envsubst | kubectl apply -f -

# 	&& cat infra/kubernetes/mysql.volume.k8s.yml       | envsubst | kubectl apply -f - \
# 	&& cat infra/kubernetes/mysql.volume-claim.k8s.yml | envsubst | kubectl apply -f - \
# 	&& cat infra/kubernetes/cache-warmer.deployment.k8s.yml     | envsubst | kubectl apply -f - \
# 	&& cat infra/kubernetes/frontend.deployment.k8s.yml | envsubst | kubectl apply -f -\
# 	&& cat infra/kubernetes/frontend.service.k8s.yml    | envsubst | kubectl apply -f -\
# 	&& cat infra/kubernetes/frontend.ingress.k8s.yml | envsubst | kubectl apply -f -

cluster-delete:
	@ export EXTERNAL_IP=${EXTERNAL_IP} \
	; kubectl delete ingress backend socket load-balancer \
	; kubectl delete deployment,service frontend backend database rabbit socket cache-warmer load-balancer \
	; kubectl delete job updater

cluster-delete-volumes:
	@ export EXTERNAL_IP=${EXTERNAL_IP} \
	; kubectl delete PersistentVolumeClaim mysql-pv-claim \
	; kubectl delete PersistentVolumeClaim mysql-volume-claim \
	; kubectl delete PersistentVolume mysql-volume

cloud-build:
	gcloud builds submit --config infra/ci/cloud-build.yml .

cert-fake:
	${DOCKER_COMPOSE} run --rm -p 80:80 certbot certonly \
		--email webmaster@seanmorr.is --agree-tos --no-eff-email --staging -d \
		seanmorr.is -d seanmorr.is

cert:
	${DOCKER_COMPOSE} run --rm -p 80:80 certbot certonly \
		--email webmaster@seanmorr.is --agree-tos --no-eff-email -d \
		seanmorr.is -d seanmorr.is
