FROM docker.io/seanmorris/subspace-socket:latest AS development

RUN docker-php-ext-install sockets bcmath

FROM development AS production

COPY ./ /app

CMD ["idilic", "server"]

RUN rm -rf /app/temporary/log.txt \
   && ln -sf /dev/stderr /app/temporary/log.txt
