#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:3000}"

curl -s "$API_BASE/api/nodes" | grep -o '"status":"up"' | wc -l | awk '{print "Up nodes:", $1}'
curl -s "$API_BASE/api/alerts" | awk '{print "Alert payload received"}'
