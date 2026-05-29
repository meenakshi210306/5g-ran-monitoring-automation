#!/usr/bin/env python3
from pathlib import Path

LOG_DIR = Path(__file__).resolve().parents[1] / 'logs'


def _all_log_files():
    # include network.log and rotated variants like network.*.log
    return sorted(LOG_DIR.glob('network*.log'))


def summarize(lines):
    failures = [line for line in lines if '[ERROR]' in line]
    overload = [line for line in lines if 'cpu' in line.lower() or 'latency' in line.lower() or 'packet loss' in line.lower()]
    crashes = [line for line in lines if 'restarted' in line.lower() or 'down' in line.lower()]
    return {
        'lines': len(lines),
        'failures': len(failures),
        'overload': len(overload),
        'crashes': len(crashes)
    }


if __name__ == '__main__':
    all_lines = []
    if LOG_DIR.exists():
        for file_path in _all_log_files():
            try:
                all_lines.extend(file_path.read_text().splitlines())
            except Exception as error:
                print('Failed to read', file_path, error)
    print(summarize(all_lines))
