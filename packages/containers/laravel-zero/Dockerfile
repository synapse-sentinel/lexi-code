ARG REGISTRY=ghcr.io/anomalyco
FROM ${REGISTRY}/build/php-laravel:latest

USER root

# Pre-install Laravel Zero installer globally
RUN composer global require laravel-zero/installer --no-interaction --no-progress \
    && echo 'export PATH="$HOME/.composer/vendor/bin:$PATH"' >> /etc/bash.bashrc

# Scaffold a fresh Laravel Zero app into /opt/laravel-zero-template
RUN composer create-project --prefer-dist laravel-zero/laravel-zero /opt/laravel-zero-template \
    --no-interaction \
    --no-progress \
    --quiet \
  && chown -R agent:agent /opt/laravel-zero-template

USER agent
WORKDIR /home/agent/workspace
