# Docker Compose - Quick Start

## Start Application

```bash
cd "Technical Test - STK"
docker-compose up -d
```

## Verify It Is Running

```bash
docker-compose ps
# Should show: "Up X seconds (healthy)"
```

## Access Application

- **Frontend**: http://localhost:8080
- **API Docs**: http://localhost:8080/api/docs
- **Health Check**: http://localhost:8080/api/ping

## Stop Application

```bash
docker-compose down
```

## Restart

```bash
docker-compose restart
```

## View Logs

```bash
docker-compose logs -f          # Follow logs
docker-compose logs --tail=50   # Last 50 lines
```

## Rebuild

```bash
docker-compose up -d --build
```

## Clean Up

```bash
docker-compose down -v          # Remove volumes too
```

## Status

- Container: Running
- API: http://localhost:8080/api
- Frontend: http://localhost:8080
- Database: PostgreSQL
- Health: Active

**Ready to use.**
