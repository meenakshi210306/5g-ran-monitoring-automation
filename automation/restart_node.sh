#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:3000}"
NODE_ID="${1:-}"

if [ -z "$NODE_ID" ]; then
  echo "Usage: ./restart_node.sh <node-id>"
  exit 1
fi

curl -s -X POST "$API_BASE/api/nodes/$NODE_ID/restart"
