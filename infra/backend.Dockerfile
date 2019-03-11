FROM php:7.3-apache
MAINTAINER Sean Morris <sean@seanmorr.is>

RUN rm -rfv /var/www/html \
	&& ln -s /app/public /var/www/html \
	&& docker-php-ext-install pdo pdo_mysql bcmath sockets

RUN a2enmod rewrite

CMD ["apache2-foreground"]
