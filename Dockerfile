FROM php:7.2-apache
MAINTAINER Sean Morris <sean@seanmorr.is>

COPY . /app
COPY ./isotope-backend.conf /etc/apache2/sites-available/isotope-backend.conf

RUN chmod -R 775 /app \
	&& chmod -R 777 /app/temporary \
	&& ln -s /app/vendor/seanmorris/ids/source/Idilic/idilic /usr/local/bin/idilic \
	&& a2enmod rewrite \
	&& a2ensite isotope-backend \
	&& docker-php-ext-install pdo_mysql \
	&& echo "Listen 9997" >> /etc/apache2/ports.conf

RUN apt-get update \
	&& apt-get install -y --no-install-recommends git zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer

RUN chmod -R 775 /app \
	&& chmod -R 777 /app/temporary \
	&& cd /app \
	&& composer clear-cache

RUN cd /app \
	&& composer install --prefer-source --no-interaction \
	&& composer update --prefer-source --no-interaction

# RUN cd /app/vendor/seanmorris/ids/source/Idilic 1 \
# 	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Ids 1 \
# 	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Access 1 \
# 	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/PressKit 1 \
# 	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Isotope 1

WORKDIR /app
