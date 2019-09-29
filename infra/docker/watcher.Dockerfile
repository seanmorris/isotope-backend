FROM gcr.io/my-project-1550542132420/worker.isotope.seanmorr.is:latest AS development
MAINTAINER Sean Morris <sean@thewhtrbt.com>
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
	&& apt update \
	&& apt install -y nodejs \
	&& npm i -g brunch

WORKDIR "/app/frontend"

CMD ["brunch", "w", "-s"]
