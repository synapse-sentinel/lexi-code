ARG REGISTRY=ghcr.io/anomalyco
FROM ${REGISTRY}/build/php-laravel:latest

ARG LARAVEL_VERSION=13

USER root

# Pre-install Laravel installer globally so agents can scaffold new apps instantly
RUN composer global require laravel/installer --no-interaction --no-progress \
    && echo 'export PATH="$HOME/.composer/vendor/bin:$PATH"' >> /etc/bash.bashrc

# Scaffold a fresh Laravel 13 app into /opt/laravel-template (read-only reference)
# Agents clone this into /home/agent/workspace instead of running `laravel new`
RUN /root/.composer/vendor/bin/laravel new /opt/laravel-template \
    --no-interaction \
    --quiet \
    --no-git \
    --database=sqlite \
  || composer create-project laravel/laravel /opt/laravel-template "^${LARAVEL_VERSION}" \
    --no-interaction \
    --no-progress \
    --quiet \
    --prefer-dist \
  && chown -R agent:agent /opt/laravel-template

USER agent
WORKDIR /home/agent/workspace
