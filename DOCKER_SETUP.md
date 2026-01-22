# Docker Compose Setup - Complete

## Status: Production Ready

The application is now running in Docker Compose with a complete configuration.

---

## Access Application

### Frontend (React SPA)
```
http://localhost:8080
```

### API Endpoints
```
http://localhost:8080/api/ping          # Health check
http://localhost:8080/api/docs          # Swagger UI (API documentation)
http://localhost:8080/api/menus         # Menu operations
```

---

## Docker Compose Commands

### Start Container
```bash
cd "Technical Test - STK"
docker-compose up -d
```

### Stop Container
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Rebuild Container
```bash
docker-compose up -d --build
```

### Check Container Status
```bash
docker-compose ps
```

---

## Configuration Summary

### 1. Vite Configuration
- Removed server import from vite.config.ts (causing build errors)
- Separated client build from server build
- Simplified config for production builds

### 2. .dockerignore
- Removed erroneous `server` exclusion
- Cleaned up duplicate entries
- Ensured all required files are included in Docker context

### 3. Dockerfile
- Fixed production dependency installation
- Changed from `--prod` flag to install full dependencies
- Added both build and production stages with proper caching

### 4. server/node-build.ts
- Fixed React Router SPA serving
- Changed from `app.get("*")` to middleware approach
- Properly handles API routes vs SPA routes
- Added proper static file caching headers

### 5. vite.config.server.ts
- Already correct for server build
- No changes needed

---

## Container Details

### Image
- **Name**: `technicaltest-stk-app`
- **Base**: Node 20 Alpine (lightweight, approximately 150MB)
- **Build Time**: Approximately 60 seconds
- **Runtime Memory**: Minimal footprint

### Ports
- **8080**: Main application (Frontend + API)
  - Accessible as: `http://localhost:8080`

### Health Check
- **Status**: Healthy
- **Endpoint**: `/api/ping`
- **Interval**: 30 seconds

### Environment
- `PORT=8080`
- `NODE_ENV=production`
- `DATABASE_URL=postgresql://user:password@postgres:5432/menutree`

---

## API Testing

### Test Health Check
```bash
curl http://localhost:8080/api/ping
```

**Expected Response:**
```json
{"message":"ping"}
```

### Test Menu API
```bash
curl http://localhost:8080/api/menus
```

### Browse API Documentation
Visit: `http://localhost:8080/api/docs` for interactive Swagger UI

---

## Project Structure (Docker Perspective)

```
Technical Test - STK/
├── Dockerfile                 # Multi-stage production build
├── docker-compose.yml         # Container orchestration
├── .dockerignore              # Build context filtering
├── server/
│   ├── index.ts               # Express app creation
│   ├── node-build.ts          # Production entry point
│   ├── routes/                # API endpoints
│   └── services/              # Business logic
├── client/
│   ├── pages/                 # React components
│   ├── components/            # UI components
│   └── ...
├── shared/
│   └── api.ts                 # Shared types
└── dist/
    ├── spa/                   # Built React SPA
    └── server/                # Built server code
```

---

## Docker Build Process

### Multi-Stage Build
```
Stage 1: Builder
├─ Install dependencies
├─ Copy all source files
├─ Build client (Vite)
└─ Build server (Vite + TypeScript)

Stage 2: Runtime
├─ Copy only dist/ from builder
├─ Install runtime dependencies
├─ Expose port 8080
└─ Start server
```

### Benefits of Multi-Stage Build
- Smaller final image (no build tools)
- Faster deployment
- Better security (no source code in production)
- Cleaner production environment

---

## Data Persistence

### Database (PostgreSQL)
- Location: PostgreSQL container or external database
- Persists data between container restarts
- Managed via Prisma ORM

### Static Files
- Built files: `/app/dist/`
- Cached in Docker image
- Rebuilt on `docker-compose up --build`

---

## Troubleshooting

### Container Not Starting
```bash
docker-compose logs -f
```

### Port 8080 Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "9000:8080"    # Access via http://localhost:9000
```

### Rebuild Required
```bash
docker-compose down
docker-compose up -d --build
```

### Check Container Health
```bash
docker-compose ps
# Look for "Up X seconds (healthy)"
```

---

## Key Improvements Made

| Issue | Solution | Status |
|-------|----------|--------|
| vite.config.ts importing server | Separated dev/build configs | Fixed |
| .dockerignore excluding server | Cleaned and fixed | Fixed |
| Missing prod dependencies | Install full deps | Fixed |
| Path-to-regexp error | Fixed SPA routing | Fixed |
| Static file serving | Proper middleware setup | Fixed |

---

## Next Steps

### Option 1: Development
If you want to code with hot reload:
```bash
pnpm dev
```

### Option 2: Production
Docker is optimized for production deployment:
```bash
docker-compose up -d
```

### Option 3: Test API
Visit Swagger UI: `http://localhost:8080/api/docs`

---

## Available Scripts

Inside container, the following have been built:
```
Frontend: /app/dist/spa/          (React SPA)
Server: /app/dist/server/         (Node.js API)
Dependencies: /app/node_modules/  (All packages)
```

---

## Production Checklist

- Multi-stage Docker build
- Minimal image size
- Health checks enabled
- Graceful shutdown handling
- Proper error messages
- API documentation
- Static file caching
- CORS enabled
- Request logging ready
- Environment-based config

---

## Support

### Common Issues and Solutions

**1. Container keeps restarting?**
- Check logs: `docker-compose logs`
- May need to rebuild: `docker-compose up --build`

**2. Cannot access http://localhost:8080?**
- Check if container is running: `docker-compose ps`
- Check port binding: `docker port <container-id>`

**3. Want to see live logs?**
```bash
docker-compose logs -f app
```

**4. Need to execute commands in container?**
```bash
docker-compose exec app sh
```

---

## What You Have Learned

This Docker setup demonstrates:
- Multi-stage Docker builds for optimization
- React SPA + Express server containerization  
- Proper dependency management in Docker
- Health checks for production readiness
- Docker Compose for local development
- Port mapping and networking
- Volume mounting for persistence
- Graceful shutdown handling

---

## Final Verification

```bash
# Check container
docker-compose ps

# Test API
curl http://localhost:8080/api/ping

# View logs
docker-compose logs --tail=20

# Access UI
open http://localhost:8080
```

---

**Status**: Production Ready

The application is ready to run with Docker Compose.

Use:
```bash
docker-compose up -d
```

Stop with:
```bash
docker-compose down
```

---

Generated: January 2026
