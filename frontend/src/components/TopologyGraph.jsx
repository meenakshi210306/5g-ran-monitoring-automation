import ReactFlow, { Background, Controls, MiniMap, Position } from 'reactflow'
import 'reactflow/dist/style.css'

const COLORS = {
  CU: '#60a5fa',
  DU: '#34d399',
  gNB: '#f59e0b',
  eNB: '#fb7185'
}

function layoutNodes(nodes) {
  const counts = { CU: 0, DU: 0, gNB: 0, eNB: 0 }
  return nodes.map(node => {
    counts[node.type] = (counts[node.type] || 0) + 1
    const lane = node.type === 'CU' ? 0 : node.type === 'DU' ? 1 : 2
    const yOffsets = { CU: 120, DU: 60, gNB: 25, eNB: 145 }
    return {
      id: node.id,
      data: { label: `${node.id}\n${node.type}` },
      position: { x: lane * 280 + 80, y: yOffsets[node.type] + (counts[node.type] - 1) * 125 },
      style: {
        width: 150,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.1)',
        padding: 14,
        color: '#07111f',
        background: COLORS[node.type] || '#fff',
        fontWeight: 800,
        textAlign: 'center',
        whiteSpace: 'pre-line'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    }
  })
}

function layoutEdges(nodes) {
  const cuNodes = nodes.filter(node => node.type === 'CU')
  const duNodes = nodes.filter(node => node.type === 'DU')
  const radioNodes = nodes.filter(node => node.type === 'gNB' || node.type === 'eNB')
  const edges = []

  cuNodes.forEach(cu => {
    duNodes.forEach(du => edges.push({ id: `${cu.id}-${du.id}`, source: cu.id, target: du.id, animated: true, style: { stroke: '#7dd3fc', strokeWidth: 2 } }))
  })
  duNodes.forEach(du => {
    radioNodes.forEach(radio => edges.push({ id: `${du.id}-${radio.id}`, source: du.id, target: radio.id, animated: true, style: { stroke: '#86efac', strokeWidth: 2 } }))
  })

  return edges
}

export default function TopologyGraph({nodes=[]}){
  const flowNodes = layoutNodes(nodes)
  const flowEdges = layoutEdges(nodes)

  return (
    <div className="chart-card" style={{height: 720}}>
      <div className="section-title">
        <div>
          <h4>Telecom Topology Graph</h4>
          <p>CU connects to DUs, and DUs connect to gNB/eNB nodes.</p>
        </div>
      </div>
      <div style={{height: 640, borderRadius: 16, overflow: 'hidden'}}>
        <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
          <MiniMap pannable zoomable />
          <Controls />
          <Background gap={18} size={1} color="rgba(255,255,255,0.08)" />
        </ReactFlow>
      </div>
    </div>
  )
}
