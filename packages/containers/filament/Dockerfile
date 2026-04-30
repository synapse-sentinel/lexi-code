ARG REGISTRY=ghcr.io/anomalyco
FROM ${REGISTRY}/build/laravel:latest

USER root

# Add Filament v5 to the template app
RUN cd /opt/laravel-template \
  && composer require filament/filament:"^5.0" --no-interaction --no-progress --quiet \
  && php artisan filament:install --panels --no-interaction \
  && chown -R agent:agent /opt/laravel-template

USER agent
WORKDIR /home/agent/workspace
