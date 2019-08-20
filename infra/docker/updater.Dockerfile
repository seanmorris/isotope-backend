FROM r.cfcr.io/seanmorris/worker.isotope.seanmorr.is:latest AS development
MAINTAINER Sean Morris <sean@seanmorr.is>

CMD idilic link 1\
	&& idilic applySchemas 1 \
	&& idilic migrate 1

FROM development AS production

COPY ./ /app
