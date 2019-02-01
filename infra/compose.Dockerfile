FROM r.cfcr.io/seanmorris/worker.isotope.seanmorr.is:latest
MAINTAINER Sean Morris <sean@seanmorr.is>
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
	&& php -r "if (hash_file('SHA384', 'composer-setup.php') === '48e3236262b34d30969dca3c37281b3b4bbe3221bda826ac6a9a62d6444cdb0dcd0615698a5cbe587c3f0fe57a54d8f5') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
	&& php composer-setup.php \
	&& php -r "unlink('composer-setup.php');" \
	&& apt update \
	&& apt install ssh git -y \
	&& mv composer.phar /usr/local/bin/composer

WORKDIR "/app"

CMD ["composer", "update", "-vvv"]
