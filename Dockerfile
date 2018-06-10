FROM php:7.2-apache
MAINTAINER Sean Morris <sean@seanmorr.is>

COPY . /app
COPY ./isotope-backend.conf /etc/apache2/sites-available/isotope-backend.conf

RUN chmod -R 775 /app \
	&& chmod -R 777 /app/temporary \
	&& mkdir -p /app/public/Static/Dynamic/Min \
	&& chmod -R 777 /app/public/Static \
	&& ln -s /app/vendor/seanmorris/ids/source/Idilic/idilic /usr/local/bin/idilic \
	&& a2enmod rewrite \
	&& a2ensite isotope-backend \
	&& docker-php-ext-install pdo_mysql \
	&& echo "Listen 9997" >> /etc/apache2/ports.conf \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends git zip openssh-server \
	&& curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer \
	&& chmod -R 775 /app \
	&& chmod -R 777 /app/temporary \
	&& cd /app \
	&& composer install --prefer-source --no-interaction

RUN ssh-keygen -t rsa -N "" -f id_rsa \
	&& mkdir -p /run/sshd

# RUN cd /app/vendor/seanmorris/ids/source/Idilic 1 \
# 	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Ids 1 \
# 	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Access 1 \
# 	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/PressKit 1 \
# 	&& ./idilic -d=isotope-backend:9997 applySchema SeanMorris/Isotope 1

WORKDIR /app

CMD apache2-foreground
