ARG REGISTRY=ghcr.io/anomalyco
FROM ${REGISTRY}/build/filament:latest

ARG OPENCODE_VERSION=0.3.55

USER root

# Add Lexi's core agent dependencies to the template
RUN cd /opt/laravel-template \
  && composer require \
    laravel/ai \
    laravel/horizon \
    laravel/octane \
    saloonphp/saloon \
    saloonphp/laravel-plugin \
    --no-interaction --no-progress --quiet \
  && php artisan horizon:install --no-interaction \
  && php artisan vendor:publish --tag=octane-config --no-interaction \
  && chown -R agent:agent /opt/laravel-template

# Bake Lexi agent definition globally
COPY agent/lexi.md /root/.opencode/agent/lexi.md

USER agent
WORKDIR /home/agent/workspace
