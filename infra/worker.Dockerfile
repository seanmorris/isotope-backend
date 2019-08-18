FROM php:7.2-apache AS development
MAINTAINER Sean Morris <sean@seanmorr.is>

RUN rm -rfv /var/www/html && ln -s /app/public /var/www/html \
	&& docker-php-ext-install pdo pdo_mysql bcmath sockets \
	&& a2enmod rewrite \
	&& docker-php-ext-install sockets \
	&& ln -s /app/vendor/seanmorris/ids/source/Idilic/idilic /usr/local/bin/idilic

CMD ["idilic", "info"]

FROM development AS production

COPY ./ /app
