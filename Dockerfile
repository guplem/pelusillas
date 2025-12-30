# This Dockerfile uses multi-stage builds to optimize the final image size
# by separating the build environment from the runtime environment.

# ~~~~~ Base ~~~~~
# Base stage: Sets up the foundation used by both build and release stages
FROM node:22-alpine AS base

# Install system dependencies
# - curl: For network requests and downloading tools
# - g++, make, python3, py3-pip: Required for building native modules
# - tini: A tiny init process to properly handle signals and zombie processes
RUN apk add --no-cache curl g++ make python3 py3-pip tini

# Set the working directory for all operations
WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY --chown=node:node package*.json ./

# ~~~~~ Build ~~~~~
# Build stage: Compiles the application and prepares dependencies
FROM base AS build

# Install all dependencies (including devDependencies)
RUN npm install

# Copy application code to the container
COPY --chown=node:node . .

# Build the application (transpile TypeScript, bundle assets, etc.)
RUN npm run build

# Remove development dependencies to reduce size
RUN npm prune --omit=dev --silent

# ~~~~~ Release ~~~~~
# Release stage: Creates the final production image
FROM base AS release

# Install production dependencies only
RUN npm install --omit=dev --silent

# Copy built application from the build stage
# The output directory for `robo build` is `.robo`: https://robojs.dev/robojs/internals#build-process
COPY --from=build /usr/src/app/ /usr/src/app/

# Create a dedicated data directory for Flashcore
RUN mkdir -p /usr/src/app/.robo/data && \
    chown -R node:node /usr/src/app/.robo/data && \
    chmod -R 755 /usr/src/app/.robo/data

# Switch to non-root user for security
USER node

# Ensure the application listens on the specified port
EXPOSE 3000

# Start the application using tini as the init process
# tini ensures proper signal handling and zombie process reaping
CMD [ "tini", "--", "npm", "start" ]
