#!/usr/bin/env python3
import os
import requests
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

API = os.getenv('API_BASE', 'http://localhost:3000')


def build_dataset(nodes):
	features = []
	labels = []

	for node in nodes:
		history = node.get('history', {})
		latency = history.get('latency', [])
		packet_loss = history.get('packetLoss', [])
		cpu = history.get('cpu', [])

		if len(latency) < 4 or len(packet_loss) < 4 or len(cpu) < 4:
			continue

		for index in range(3, min(len(latency), len(packet_loss), len(cpu))):
			feature_row = [
				latency[index],
				packet_loss[index],
				cpu[index],
				latency[index] - latency[index - 3],
				packet_loss[index] - packet_loss[index - 3],
			]
			label = int(
				feature_row[0] > 100 or
				feature_row[1] > 5 or
				feature_row[2] > 90 or
				(feature_row[3] > 8 and feature_row[4] > 0.8)
			)
			features.append(feature_row)
			labels.append(label)

	return np.array(features, dtype=float), np.array(labels, dtype=int)


def main():
	response = requests.get(f'{API}/api/nodes', timeout=5)
	nodes = response.json()
	features, labels = build_dataset(nodes)

	if len(features) < 8 or len(set(labels.tolist())) < 2:
		print('Not enough telemetry history for anomaly model training yet.')
		return

	model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=250))
	model.fit(features, labels)

	predictions = []
	for node in nodes:
		metrics = node.get('metrics', {})
		history = node.get('history', {})
		latency = history.get('latency', [metrics.get('latency', 0)])
		packet_loss = history.get('packetLoss', [metrics.get('packetLoss', 0)])
		cpu = history.get('cpu', [metrics.get('cpu', 0)])

		feature_row = np.array([[
			latency[-1],
			packet_loss[-1],
			cpu[-1],
			latency[-1] - latency[max(0, len(latency) - 4)],
			packet_loss[-1] - packet_loss[max(0, len(packet_loss) - 4)],
		]], dtype=float)

		probability = float(model.predict_proba(feature_row)[0][1])
		if probability >= 0.5:
			predictions.append({
				'node': node['id'],
				'riskScore': round(probability * 100, 1),
				'message': f"Predicted failure alert: {node['id']} has a {probability * 100:.1f}% risk of degradation"
			})

	print({'predictedFailureAlerts': predictions})


if __name__ == '__main__':
	main()
