FROM rabbitmq:3.8.0-management AS development

FROM development AS production

COPY ./data/global/rabbitMq/enabled_plugins /etc/rabbitmq/enabled_plugins
