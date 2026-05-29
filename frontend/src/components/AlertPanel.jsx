export default function AlertPanel({title='Alerts', description='Recent threshold breaches and recovery events.', alerts=[]}){
  return (
    <aside className="panel alert-panel">
      <div className="section-title">
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      </div>
      {alerts.length ? (
        <ul>
          {alerts.map((item, index)=> <li key={index}>{typeof item === 'string' ? item : item.message}</li>)}
        </ul>
      ) : (
        <div className="alert-empty">No items to show right now.</div>
      )}
    </aside>
  )
}
