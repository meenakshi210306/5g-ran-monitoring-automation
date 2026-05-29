const USERS = [
  { username: 'admin', role: 'Admin', status: 'active' },
  { username: 'engineer', role: 'Network Engineer', status: 'active' },
  { username: 'viewer', role: 'Viewer', status: 'active' }
]

exports.list = (req, res) => {
  res.json(USERS)
}
