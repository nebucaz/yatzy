# Docker Deployment Guide

This guide explains how to build and deploy the Yatzy score tracking application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and run the container:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   Open your browser and navigate to `http://localhost:8080`

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

### Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t yatzy-app .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 8080:80 --name yatzy-app yatzy-app
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:8080`

4. **Stop the container:**
   ```bash
   docker stop yatzy-app
   docker rm yatzy-app
   ```

## Production Deployment

### Build for Production

The Dockerfile uses a multi-stage build:
1. **Builder stage**: Uses Bun to install dependencies and build the application
2. **Production stage**: Uses nginx to serve the static files

### Customizing the Port

To change the port, modify `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:80"
```

Or when using Docker directly:
```bash
docker run -d -p YOUR_PORT:80 --name yatzy-app yatzy-app
```

### Environment Variables

The application is a static SPA and doesn't require environment variables. All data is stored in the browser's localStorage.

## Docker Image Details

- **Base image (builder)**: `oven/bun:1` - Fast JavaScript runtime
- **Base image (production)**: `nginx:alpine` - Lightweight web server
- **Build output**: Static files in `/app/build`
- **Served from**: `/usr/share/nginx/html` in the nginx container

## Troubleshooting

### Build fails
- Ensure Docker is running
- Check that all files are present (Dockerfile, package.json, etc.)
- Verify you have enough disk space

### Application doesn't load
- Check if the container is running: `docker ps`
- Check container logs: `docker logs yatzy-app`
- Verify the port is not already in use

### Changes not reflected
- Rebuild the image: `docker-compose build --no-cache`
- Restart the container: `docker-compose restart`

## Development vs Production

- **Development**: Use `bun run dev` for hot-reloading
- **Production**: Use Docker for a production-ready static build

## Notes

- The application uses browser localStorage, so data persists in the user's browser
- No backend server is required - it's a fully static application
- The nginx configuration includes SPA routing support and gzip compression


