FROM r.cfcr.io/seanmorris/worker.isotope.seanmorr.is:latest
MAINTAINER Sean Morris <sean@seanmorr.is>
CMD idilic link 1\
	&& idilic applySchemas 1 \
	&& idilic migrate 1
