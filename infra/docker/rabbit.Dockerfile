FROM nginx:alpine AS development

FROM development AS production

COPY ./data/global/nginx/nginx.conf /etc/nginx/nginx.conf
