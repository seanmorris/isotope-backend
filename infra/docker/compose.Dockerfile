FROM r.cfcr.io/seanmorris/worker.isotope.seanmorr.is:latest AS development
MAINTAINER Sean Morris <sean@seanmorr.is>
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
	&& php composer-setup.php \
	&& php -r "unlink('composer-setup.php');" \
	&& apt update \
	&& apt install ssh git -y \
	&& mv composer.phar /usr/local/bin/composer

WORKDIR "/app"
