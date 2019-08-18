FROM php:7.2-apache AS development
MAINTAINER Sean Morris <sean@seanmorr.is>

RUN rm -rfv /var/www/html \
	&& ln -s /app/public /var/www/html \
	&& docker-php-ext-install pdo pdo_mysql bcmath sockets \
	&& a2enmod rewrite

CMD ["apache2-foreground"]

FROM development AS production

COPY ./ /app

RUN rm -rfv /var/www/html \
	&& a2enmod rewrite \
	&& ln -s /app/public /var/www/html
