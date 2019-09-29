FROM gcr.io/my-project-1550542132420/worker.isotope.seanmorr.is:latest AS development
MAINTAINER Sean Morris <sean@seanmorr.is>

CMD idilic link 1\
	&& idilic applySchemas 1 \
	&& idilic migrate 1

FROM development AS production

COPY ./ /app

RUN rm -rf /app/temporary/log.txt \
   && ln -sf /dev/stderr /app/temporary/log.txt