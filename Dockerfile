FROM php:7.2-apache
MAINTAINER Sean Morris <sean@seanmorr.is>

COPY . /app
COPY ./isotope-backend.conf /etc/apache2/sites-available/isotope-backend.conf

RUN chmod -R 775 /app \
	&& chmod -R 777 /app/temporary \
	&& mkdir -p /app/public/Static/Dynamic/Min \
	&& chmod -R 777 /app/public/Static \
	&& a2enmod rewrite \
	&& a2ensite isotope-backend \
	&& docker-php-ext-install pdo_mysql \
	&& ln -s /app/vendor/seanmorris/ids/source/Idilic/idilic /usr/local/bin/idilic \
	&& echo "Listen 9997" | tee /etc/apache2/ports.conf

# RUN cd /app/vendor/seanmorris/ids/source/Idilic \
#	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Ids \
#	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Access \
#	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/PressKit \
#	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Isotope

WORKDIR /app
