ARG REGISTRY=ghcr.io/anomalyco
FROM ${REGISTRY}/build/bun-node:24.04

ARG DEBIAN_FRONTEND=noninteractive
ARG PHP_VERSION=8.4
ARG GH_VERSION=2.71.0
ARG OPENCODE_VERSION=0.3.55

SHELL ["/bin/bash", "-lc"]

# PHP 8.4 + Composer
RUN set -euo pipefail; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
    software-properties-common; \
  add-apt-repository ppa:ondrej/php; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
    php${PHP_VERSION} \
    php${PHP_VERSION}-cli \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-dom \
    php${PHP_VERSION}-mbstring \
    php${PHP_VERSION}-pgsql \
    php${PHP_VERSION}-redis \
    php${PHP_VERSION}-sqlite3 \
    php${PHP_VERSION}-xml \
    php${PHP_VERSION}-zip; \
  rm -rf /var/lib/apt/lists/*

RUN set -euo pipefail; \
  curl -fsSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer; \
  composer --version

# GitHub CLI
RUN set -euo pipefail; \
  arch=$(uname -m); \
  gh_arch=amd64; \
  if [ "$arch" = "aarch64" ]; then gh_arch=arm64; fi; \
  curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_${gh_arch}.tar.gz" \
  | tar -xzf - -C /usr/local --strip-components=1 "gh_${GH_VERSION}_linux_${gh_arch}/bin/gh"; \
  gh --version

# opencode
RUN set -euo pipefail; \
  npm install -g opencode-ai@${OPENCODE_VERSION}; \
  opencode --version

# Standard agentctl run-task entrypoint (opencode variant)
RUN printf '#!/bin/sh\nexec opencode run -p "$@"\n' \
    > /usr/local/bin/run-task \
    && chmod +x /usr/local/bin/run-task

# Agent user
RUN useradd -m -s /bin/bash agent \
    && mkdir -p /home/agent/workspace \
    && chown -R agent:agent /home/agent

# Bake Lexi agent definition globally so every workspace gets her
COPY agent/lexi.md /root/.opencode/agent/lexi.md

USER agent
WORKDIR /home/agent/workspace
