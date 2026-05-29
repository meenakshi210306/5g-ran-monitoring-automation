#!/usr/bin/env python3
import os
import sys
import requests

API = os.getenv('API_BASE', 'http://localhost:3000')


def is_unhealthy(node):
    metrics = node.get('metrics', {})
    return any([
        metrics.get('latency', 0) > 100,
        metrics.get('packetLoss', 0) > 5,
        metrics.get('cpu', 0) > 90,
    ])


def main():
    try:
        nodes = requests.get(f'{API}/api/nodes', timeout=5).json()
        alerts = requests.get(f'{API}/api/alerts', timeout=5).json()

        healthy = sum(1 for node in nodes if node.get('status') == 'up')
        print(f'Nodes alive: {healthy}/{len(nodes)}')
        print(f'Open alerts: {len(alerts)}')

        for node in nodes:
            metrics = node.get('metrics', {})
            if is_unhealthy(node):
                print(f"Node unhealthy: {node['id']} latency={metrics.get('latency', 0):.1f} ms packetLoss={metrics.get('packetLoss', 0):.2f}% cpu={metrics.get('cpu', 0):.1f}%")

        return 0
    except Exception as error:
        print('ERROR', error)
        return 2


if __name__ == '__main__':
    sys.exit(main())
