#!/usr/bin/env python3
import os
import time
import requests

API = os.getenv('API_BASE', 'http://localhost:3000')


def restart_bad_nodes():
	# fetch alerts and restart affected nodes (simulation of auto-recovery)
	alerts = requests.get(f'{API}/api/alerts', timeout=5).json()
	target_nodes = sorted({alert.get('node') for alert in alerts if alert.get('node')})

	for node_id in target_nodes:
		print(f'Requesting restart for {node_id}')
		try:
		  response = requests.post(f'{API}/api/nodes/{node_id}/restart', timeout=5)
		  print(response.json())
		except Exception as error:
		  print('Failed to restart', node_id, error)
		time.sleep(0.5)


if __name__ == '__main__':
	restart_bad_nodes()
