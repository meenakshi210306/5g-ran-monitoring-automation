import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function TrafficChart({nodes=[]}){
  const series = nodes.slice(0, 3)
  const buildData = (key) => {
    const length = series[0]?.history?.[key]?.length || 0
    const data = []
    for (let i = 0; i < length; i++) {
      const row = { index: i }
      series.forEach(s => {
        row[`${s.id}`] = s.history?.[key]?.[i] ?? null
      })
      data.push(row)
    }
    return data
  }

  const metricCharts = [
    { label: 'Latency', key: 'latency', stroke: '#fb7185', dash: '4 4' },
    { label: 'Throughput', key: 'throughput', stroke: '#4cc9f0' },
    { label: 'Packet Loss', key: 'packetLoss', stroke: '#f59e0b' },
    { label: 'CPU Usage', key: 'cpu', stroke: '#7cdbb6' },
    { label: 'Memory Usage', key: 'memory', stroke: '#a855f7' }
  ]

  return (
    <div className="chart-card">
      <div className="section-title">
        <div>
          <h4>Network Metric Charts</h4>
          <p>Latency, throughput, packet loss, CPU, and memory traces from live node history.</p>
        </div>
      </div>
      <div className="metric-chart-grid">
        {metricCharts.map(metric => (
          <div key={metric.key} className="metric-chart-box">
            <strong>{metric.label}</strong>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={buildData(metric.key)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="index" hide />
                <YAxis stroke="#93a8c8" />
                <Tooltip contentStyle={{ background: '#07111f', border: '1px solid rgba(255,255,255,0.12)' }} />
                <Legend />
                {series.map((s, idx) => (
                  <Line
                    key={`${metric.key}-${s.id}`}
                    type="monotone"
                    dataKey={s.id}
                    stroke={['#4cc9f0', '#7cdbb6', '#f9c74f'][idx % 3]}
                    dot={false}
                    strokeWidth={metric.key === 'latency' ? 2.5 : 2}
                    strokeDasharray={metric.dash || '0'}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
