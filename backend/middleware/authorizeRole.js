const { hasPermission } = require('../utils/rbac')

module.exports = function authorizeRole(permission){
  return (req, res, next) => {
    const role = req.user?.role
    if (!role || !hasPermission(role, permission)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
