#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="${1:-logs/network.log}"

tail -f "$LOG_FILE"
