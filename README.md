# 5G Network Monitoring & Automation Dashboard

Telecom-style full-stack monitoring platform for simulated 4G/5G infrastructure.

It includes live gNB, eNB, DU, and CU node simulators, alert generation, log storage, topology visualization, role-based login, automation scripts, Docker support, and CI checks.

## Features

- React + Vite dashboard with a responsive dark/light UI
- Node status cards with green, yellow, and red health states
- Live metric charts for latency, throughput, packet loss, CPU, and memory
- Socket.IO live updates for nodes and alerts
- Telemetry-style logs stored in `logs/network.log`
- Topology visualization using React Flow
- Role-based login for Admin, Network Engineer, and Viewer
- Analytics summary with average latency, uptime, failures, and predicted failure alerts
- Python automation scripts plus Bash helpers
- Dockerfiles and GitHub Actions workflow

## Project Structure

- `frontend/` - React + Vite UI
- `backend/` - Express API, Socket.IO, simulator, auth, analytics
- `automation/` - Python and Bash automation scripts
- `logs/` - generated network logs
- `docker/` - Dockerfiles and compose file
- `.github/workflows/` - CI pipeline

## Quick Start

### Backend

```powershell
cd backend
npm install
npm start
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

By default the frontend talks to the backend on `http://localhost:3001`.

## Sample Login

Use one of these accounts:

- Admin: `admin / admin123`
- Network Engineer: `engineer / engineer123`
- Viewer: `viewer / viewer123`

## API Endpoints

- `GET /api/nodes` - node list and live telemetry
- `POST /api/nodes/:id/restart` - simulate node restart
- `GET /api/alerts` - active alert list
- `GET /api/logs` - recent network log lines
- `GET /api/analytics` - averages, uptime, node performance, predicted failures
- `POST /api/auth/login` - role-based login
- `GET /api/auth/me` - validate the current token

## Automation

Python scripts:

- `automation/health_check.py`
- `automation/auto_restart.py`
- `automation/log_analyzer.py`
- `automation/traffic_predictor.py`

Bash scripts:

- `automation/check_status.sh`
- `automation/restart_node.sh`
- `automation/monitor_logs.sh`

Install Python dependencies:

```powershell
pip install -r automation/requirements.txt
```

## Docker

- `docker/frontend.Dockerfile`
- `docker/backend.Dockerfile`
- `docker/docker-compose.yml`

## CI/CD

- GitHub Actions workflow: `.github/workflows/ci.yml`
- Checks frontend build and backend syntax validation

## Screenshots

Add production screenshots here after deployment.

## Notes

- Logs are written in telecom style, for example: `[ERROR] gnb-4 latency 129.3 ms exceeded threshold`
- Predicted failure alerts are generated from rising latency and packet-loss trends
- Environment examples are available in `backend/.env.example` and `frontend/.env.example`
