const jwt = require('jsonwebtoken')

const USERS = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'engineer', password: 'engineer123', role: 'Network Engineer' },
  { username: 'viewer', password: 'viewer123', role: 'Viewer' }
]

exports.login = (req, res) => {
  const { username, password } = req.body || {}
  const user = USERS.find(u => u.username === username && u.password === password)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  )

  res.json({
    token,
    user: { username: user.username, role: user.role }
  })
}

exports.me = (req, res) => {
  res.json({ user: req.user })
}
