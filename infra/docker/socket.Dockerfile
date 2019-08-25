FROM basic-socket:latest AS development

RUN docker-php-ext-install sockets bcmath

FROM development AS production

COPY ./ /app

CMD ["idilic", "server"]
