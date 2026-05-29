import { useEffect, useState } from 'react'
import TopologyGraph from '../components/TopologyGraph'
import { fetchNodes } from '../services/api'

export default function Topology(){
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    fetchNodes().then(setNodes).catch(() => {})
  }, [])

  return (
    <div className="page-shell">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Topology</h2>
            <p>Visual telecom layout showing CU to DU and DU to gNB/eNB connections.</p>
          </div>
        </div>
      </section>
      <TopologyGraph nodes={nodes} />
    </div>
  )
}
